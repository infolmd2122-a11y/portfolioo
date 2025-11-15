@echo off
REM =========================
REM Script pour mettre à jour le site GitHub Pages
REM =========================

echo =========================
echo Mise à jour du site Portfolio...
echo =========================

REM Aller dans le dossier du projet (ajuste le chemin si nécessaire)
cd /d "%~dp0"

REM Ajouter tous les fichiers modifiés
git add .

REM Faire un commit avec la date et l'heure
git commit -m "Update site: %date% %time%"

REM Envoyer sur GitHub
git push origin main

echo =========================
echo Mise à jour terminée !
echo Ouvrez votre site GitHub Pages pour voir les changements.
pause
