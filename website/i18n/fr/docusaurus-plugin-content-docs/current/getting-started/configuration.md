---
id: configuration
title: Configuration
sidebar_position: 2
---

# Configuration Google Cloud

Pour utiliser `sheets-translate-to-json`, vous avez besoin d'un compte de service Google Cloud avec accès à l'API Google Sheets.

## Étape 1 : Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/).
2. Cliquez sur le sélecteur de projet en haut, puis **Nouveau projet**.
3. Entrez un nom de projet et cliquez sur **Créer**.

![new-project](/img/creat-project.png)

## Étape 2 : Activer l'API Google Sheets

1. Dans le menu de navigation, allez dans **APIs & Services** > **Library**.
2. Recherchez **Google Sheets API** et cliquez sur **Activer**.

![enable-api](/img/enable-api.png)

## Étape 3 : Créer un compte de service

1. Allez dans **IAM & Admin** > **Service Accounts**.
2. Cliquez sur **Create Service Account**.
3. Entrez un nom et une description, puis cliquez sur **Create and Continue**.

![create-service-account](/img/create-service-account.png)

## Étape 4 : Attribuer des rôles (optionnel)

1. Sélectionnez un rôle approprié (par exemple, **Editor**).
2. Cliquez sur **Continue**, puis **Done**.

## Étape 5 : Créer une clé JSON

1. Cliquez sur votre compte de service, puis allez dans l'onglet **Keys**.
2. Cliquez sur **Add Key** > **Create new key**.
3. Sélectionnez **JSON** et cliquez sur **Create**.
4. Un fichier JSON sera téléchargé. **Conservez-le en lieu sûr.**

![details-key](/img/details-key.jpeg)

---

![add-key](/img/add-key.jpeg)

---

![create-key](/img/create-key.jpeg)

:::caution
Ne commitez jamais votre clé de compte de service dans le contrôle de version. Utilisez des variables d'environnement pour stocker `privateKey` et `clientEmail`.
:::

## Étape 6 : Partager votre feuille de calcul

Partagez votre feuille de calcul Google Sheets avec l'adresse e-mail du compte de service (que vous trouverez dans le fichier de clé JSON sous `client_email`). Donnez-lui un accès **Éditeur**.
