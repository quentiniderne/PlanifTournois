import requests
from bs4 import BeautifulSoup
import csv
import time
import re

ID_DEBUT = 141907
ID_FIN = 141917
MAX_ERREURS = 20

colonnes = [
    "idtournoi", "libtournoi", "typetournoi", "datdeb", "datfin",
    "classementSM", "classementSD", "surface", "adresse", "tarif_senior", "tarif_junior", "dotation",
    "format", "libja", "numja", "mailja", "SM", "SD", "DM", "DD", "DX", "Senior", "Junior"
]

def clean(text):
    return " ".join(text.strip().split()) if text else ""

def parse_tournoi(url, idtournoi):
    response = requests.get(url, timeout=10)
    if response.status_code != 200:
        raise ValueError(f"HTTP {response.status_code}")

    soup = BeautifulSoup(response.text, "html.parser")

    h1 = soup.find("h1")
    if not h1:
        raise ValueError("Pas de libellé tournoi trouvé")
    libtournoi = clean(h1.text)

    if "TMC" in libtournoi:
        typetournoi = "TMC"
    else:
        type_span = soup.select_one("span.tournoi-detail-page-competition-content")
        typetournoi = "Championnat" if type_span and "championnat" in type_span.text.lower() else "Tournoi"

    datdeb = clean(soup.select_one("span.tournoi-detail-page-date-debut").text) if soup.select_one("span.tournoi-detail-page-date-debut") else ""
    datfin = clean(soup.select_one("span.tournoi-detail-page-date-fin").text) if soup.select_one("span.tournoi-detail-page-date-fin") else datdeb

    surfaces = soup.select("span.tournoi-detail-page-competition-surfaces-content")
    surface = " / ".join([clean(s.text) for s in surfaces]) if surfaces else ""

    dotation = clean(soup.select_one("span.tournoi-detail-page-competition-dotation-content").text) if soup.select_one("span.tournoi-detail-page-competition-dotation-content") else ""

    addr1 = soup.select_one(".tournoi-detail-page-lieu-addr1")
    addr2 = soup.select_one(".tournoi-detail-page-lieu-addr2")
    adresse = ", ".join(filter(None, [clean(addr1.text) if addr1 else "", clean(addr2.text) if addr2 else ""]))

    libja = ""
    libja_div = soup.select_one("span.tournoi-detail-page-competition-juge-content")
    if not libja_div:
        alt = soup.select_one(".tournoi-detail-page-inscription-nom .details-bloc")
        libja = clean(alt.text) if alt else ""
    else:
        libja = clean(libja_div.text)

    numja_div = soup.select_one(".tournoi-detail-page-inscription-telephone .details-bloc")
    numja = clean(numja_div.text) if numja_div else ""

    mailja_div = soup.select_one(".tournoi-detail-page-inscription-email .details-bloc a")
    mailja = clean(mailja_div.text) if mailja_div else ""

    types_epreuve = {"SM": 0, "SD": 0, "DM": 0, "DD": 0, "DX": 0}
    cat_flags = {"Senior": 0, "Junior": 0}
    classementSM = ""
    classementSD = ""
    tarif_senior = ""
    tarif_junior = ""
    format_jeu = ""

    blocs_epreuves = soup.select("div.cartouche-epreuve-inner")

    for bloc in blocs_epreuves:
        titre_div = bloc.select_one(".epreuve-detail-titre")
        titre_txt = clean(titre_div.text) if titre_div else ""

        if "senior" in titre_txt.lower():
            cat_flags["Senior"] = 1
        if "junior" in titre_txt.lower():
            cat_flags["Junior"] = 1

        if "simple messieurs" in titre_txt.lower():
            types_epreuve["SM"] = 1
        elif "simple dames" in titre_txt.lower():
            types_epreuve["SD"] = 1
        elif "double messieurs" in titre_txt.lower():
            types_epreuve["DM"] = 1
        elif "double dames" in titre_txt.lower():
            types_epreuve["DD"] = 1
        elif "double mixte" in titre_txt.lower():
            types_epreuve["DX"] = 1

        tarifs_divs = bloc.select("div.epreuve-detail-tarif-detail")
        for t in tarifs_divs:
            ttxt = t.text.lower()
            if "adulte" in ttxt or "senior" in ttxt:
                tarif_senior = clean(t.text.split(":")[-1])
            elif "jeune" in ttxt or "junior" in ttxt:
                tarif_junior = clean(t.text.split(":")[-1])

        if not format_jeu:
            format_div = bloc.select_one(".epreuve-detail-format")
            if format_div:
                m = re.search(r"Format\\s*:\\s*(\\d)", format_div.text)
                if m:
                    format_jeu = m.group(1)

        # Recherche du classement
        classement_txt = ""
        for div in bloc.select("div"):
            text = div.get_text(strip=True)
            if re.search(r"classement\\s*:", text, flags=re.I):
                m = re.search(r"classement\\s*:\\s*([^\n\r]*)", text, flags=re.I)
                if m:
                    possible_classement = m.group(1).strip()
                    classement_txt = re.match(r"^[A-Za-z0-9/ .\-]+", possible_classement)
                    classement_txt = classement_txt.group(0).strip() if classement_txt else possible_classement
                break

        if "simple messieurs" in titre_txt.lower():
            classementSM = classement_txt
        elif "simple dames" in titre_txt.lower():
            classementSD = classement_txt

    if tarif_senior.replace("€", "").strip() in ["0", "0.00", "0,00"]:
        if types_epreuve["DM"] == 0 and types_epreuve["DD"] == 0 and types_epreuve["DX"] == 0:
            cat_flags["Junior"] = 1
            cat_flags["Senior"] = 0

    return {
        "idtournoi": int(idtournoi),
        "libtournoi": libtournoi,
        "typetournoi": typetournoi,
        "datdeb": datdeb,
        "datfin": datfin,
        "classementSM": classementSM,
        "classementSD": classementSD,
        "surface": surface,
        "adresse": adresse,
        "tarif_senior": tarif_senior.replace("€", "").replace(",", "."),
        "tarif_junior": tarif_junior.replace("€", "").replace(",", "."),
        "dotation": float(dotation.replace("€", "").replace(",", ".").strip()) if dotation else 0,
        "format": format_jeu,
        "libja": libja,
        "numja": numja,
        "mailja": mailja,
        "SM": types_epreuve["SM"],
        "SD": types_epreuve["SD"],
        "DM": types_epreuve["DM"],
        "DD": types_epreuve["DD"],
        "DX": types_epreuve["DX"],
        "Senior": cat_flags["Senior"],
        "Junior": cat_flags["Junior"],
    }

# Boucle principale
tournois = []
erreurs_consecutives = 0

for i in range(ID_DEBUT, ID_FIN + 1):
    url = f"https://tenup.fft.fr/tournoi/{i}"
    print(f"🔍 Scraping {url}")
    try:
        data = parse_tournoi(url, i)
        print(f"✅ {data['libtournoi']}")
        tournois.append(data)
        erreurs_consecutives = 0
        time.sleep(0.5)
        if i % 20 == 0:
            print("⏸ Pause 10s pour limiter surcharge...")
            time.sleep(10)
    except Exception as e:
        erreurs_consecutives += 1
        print(f"⚠️ Erreur ({erreurs_consecutives}/{MAX_ERREURS}) — {str(e)}")
        if erreurs_consecutives >= MAX_ERREURS:
            print("⛔ Trop d’erreurs. Script interrompu.")
            break

# Export CSV
if tournois:
    with open("tournois_tenup.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=colonnes)
        writer.writeheader()
        writer.writerows(tournois)
    print("✅ Données enregistrées dans tournois_tenup.csv")
else:
    print("⚠️ Aucun tournoi récupéré.")