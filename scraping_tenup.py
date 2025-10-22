from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import csv
import time
import re

ID_DEBUT = 164036
ID_FIN = 164040  # tu peux étendre
MAX_ERREURS = 20

colonnes = [
    "idtournoi", "libtournoi", "typetournoi", "datdeb", "datfin",
    "classementSM", "classementSD", "classementSX", "surface", "adresse",
    "tarif_senior", "tarif_junior", "dotation", "format",
    "libja", "numja", "mailja",
    "SM", "SD", "SX", "DM", "DD", "DX",
    "Senior", "Junior",
    "latitude", "longitude"
]

def clean(text):
    return " ".join(text.strip().split()) if text else ""

def parse_tournoi_html(html, idtournoi):
    soup = BeautifulSoup(html, "html.parser")

    h1 = soup.find("h1")
    if not h1:
        raise ValueError("Pas de libellé tournoi trouvé")
    libtournoi = clean(h1.text)

    # Type tournoi
    if "TMC" in libtournoi:
        typetournoi = "TMC"
    else:
        type_span = soup.select_one("span.tournoi-detail-page-competition-content")
        typetournoi = "Championnat" if type_span and "championnat" in type_span.text.lower() else "Tournoi"

    datdeb = clean(soup.select_one("span.tournoi-detail-page-date-debut").text) if soup.select_one("span.tournoi-detail-page-date-debut") else ""
    datfin = clean(soup.select_one("span.tournoi-detail-page-date-fin").text) if soup.select_one("span.tournoi-detail-page-date-fin") else datdeb

    surfaces = soup.select("span.tournoi-detail-page-competition-surfaces-content")
    surface = " , ".join([clean(s.text) for s in surfaces]) if surfaces else ""

    dotation = clean(soup.select_one("span.tournoi-detail-page-competition-dotation-content").text) if soup.select_one("span.tournoi-detail-page-competition-dotation-content") else "0"

    addr1 = soup.select_one(".tournoi-detail-page-lieu-addr1")
    addr2 = soup.select_one(".tournoi-detail-page-lieu-addr2")
    adresse = ", ".join(filter(None, [clean(addr1.text) if addr1 else "", clean(addr2.text) if addr2 else ""]))

    # --- Coordonnées GPS ---
    lat = ""
    lng = ""
    iframe = soup.select_one(".tournoi-detail-page-lieu-map iframe")
    if iframe and iframe.has_attr("src"):
        m = re.search(r"maps\?q=([-0-9.]+),([-0-9.]+)", iframe["src"])
        if m:
            lat, lng = m.groups()


    # Juge-arbitre
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

    # Initialisation des types d'épreuve et catégories
    types_epreuve = {"SM": 0, "SD": 0, "SX":0, "DM": 0, "DD": 0, "DX": 0}
    cat_flags = {"Senior": 0, "Junior": 0}
    tarif_senior = ""
    tarif_junior = ""
    format_jeu = ""
    classementSM = ""
    classementSD = ""
    classementSX = ""

    blocs_epreuves = soup.select("div.cartouche-epreuve-inner")
    for bloc in blocs_epreuves:
        titre_div = bloc.select_one(".epreuve-detail-titre")
        titre_txt = clean(titre_div.text) if titre_div else ""

        # Catégories
        if "senior" in titre_txt.lower():
            cat_flags["Senior"] = 1
        if "junior" in titre_txt.lower():
            cat_flags["Junior"] = 1

        # Tarifs
        for t in bloc.select("div.epreuve-detail-tarif-detail"):
            ttxt = t.text.lower()
            if "adulte" in ttxt or "senior" in ttxt:
                tarif_senior = clean(t.text.split(":")[-1])
            elif "jeune" in ttxt or "junior" in ttxt:
                tarif_junior = clean(t.text.split(":")[-1])

        # Format
        if not format_jeu:
            format_div = bloc.select_one(".epreuve-detail-format")
            if format_div:
                m = re.search(r"Format\s*:\s*(\d)", format_div.text)
                if m:
                    format_jeu = m.group(1)

        # Types d'épreuve
        nature_txt = titre_txt.split()[0].upper() if titre_txt else ""
        if nature_txt in types_epreuve:
            types_epreuve[nature_txt] = 1

        # Classement
        classement_div = bloc.select_one(".epreuve-detail-classement-detail")
        if classement_div:
            classement_txt = classement_div.text.strip()
            classement_nettoye = re.sub(r"(?i)^classement\s*:\s*", "", classement_txt).strip()
            if "simple messieurs" in titre_txt.lower() or "sm" in titre_txt.lower():
                classementSM = classement_nettoye
            elif "simple dames" in titre_txt.lower() or "sd" in titre_txt.lower():
                classementSD = classement_nettoye
            elif "simple mixte" in titre_txt.lower() or "sx" in titre_txt.lower():
                classementSX = classement_nettoye

    # Déduction Senior/Junior si nécessaire
    if tarif_junior.replace("€","").strip() in ["0","0,00"]:
        if types_epreuve["SM"] == 0 and types_epreuve["SD"] == 0 and types_epreuve["SX"] == 0:
            cat_flags["Senior"] = 1
            cat_flags["Junior"] = 0

    return {
        "idtournoi": int(idtournoi),
        "libtournoi": libtournoi,
        "typetournoi": typetournoi,
        "datdeb": datdeb,
        "datfin": datfin,
        "classementSM": classementSM,
        "classementSD": classementSD,
        "classementSX": classementSX,
        "surface": surface,
        "adresse": adresse,
        "tarif_senior": tarif_senior.replace("€","").replace(",","."),
        "tarif_junior": tarif_junior.replace("€","").replace(",","."),
        "dotation": float(dotation.replace("€","").replace(",",".").strip()) if dotation else 0,
        "format": format_jeu,
        "libja": libja,
        "numja": numja,
        "mailja": mailja,
        "SM": types_epreuve["SM"],
        "SD": types_epreuve["SD"],
        "SX": types_epreuve["SX"],
        "DM": types_epreuve["DM"],
        "DD": types_epreuve["DD"],
        "DX": types_epreuve["DX"],
        "Senior": cat_flags["Senior"],
        "Junior": cat_flags["Junior"],
        "latitude": lat,
        "longitude": lng
    }

# --- Boucle principale avec Playwright ---
tournois = []
erreurs_consecutives = 0

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    for i in range(ID_DEBUT, ID_FIN + 1):
        url = f"https://tenup.fft.fr/tournoi/{i}"
        print(f"🔍 Scraping {url}")
        try:
            page.goto(url)
            page.wait_for_selector("h1", timeout=10000)  # attend que le h1 soit chargé
            html = page.content()
            data = parse_tournoi_html(html, i)
            print(f"✅ {data['libtournoi']}")
            tournois.append(data)
            erreurs_consecutives = 0
            time.sleep(0.5)
        except Exception as e:
            erreurs_consecutives += 1
            print(f"⚠️ Erreur ({erreurs_consecutives}/{MAX_ERREURS}) — {str(e)}")
            if erreurs_consecutives >= MAX_ERREURS:
                print("⛔ Trop d’erreurs. Script interrompu.")
                break

    browser.close()

# Export CSV
if tournois:
    with open("tournois_smashup.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=colonnes)
        writer.writeheader()
        writer.writerows(tournois)
    print("✅ Données enregistrées dans tournois_smashup.csv")
else:
    print("⚠️ Aucun tournoi récupéré.")

