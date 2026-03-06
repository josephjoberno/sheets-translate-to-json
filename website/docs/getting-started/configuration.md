---
id: configuration
title: Configuration
sidebar_position: 2
---

# Google Cloud Configuration

To use `sheets-translate-to-json`, you need a Google Cloud service account with access to the Google Sheets API.

## Step 1: Create a Google Cloud project

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project selector at the top, then **New Project**.
3. Enter a project name and click **Create**.

![new-project](/img/creat-project.png)

## Step 2: Enable the Google Sheets API

1. In the navigation menu, go to **APIs & Services** > **Library**.
2. Search for **Google Sheets API** and click **Enable**.

![enable-api](/img/enable-api.png)

## Step 3: Create a service account

1. Go to **IAM & Admin** > **Service Accounts**.
2. Click **Create Service Account**.
3. Enter a name and description, then click **Create and Continue**.

![create-service-account](/img/create-service-account.png)

## Step 4: Assign roles (optional)

1. Select an appropriate role (e.g., **Editor**).
2. Click **Continue**, then **Done**.

## Step 5: Create a JSON key

1. Click on your service account, then go to the **Keys** tab.
2. Click **Add Key** > **Create new key**.
3. Select **JSON** and click **Create**.
4. A JSON file will be downloaded. **Keep it secure.**

![details-key](/img/details-key.jpeg)

---

![add-key](/img/add-key.jpeg)

---

![create-key](/img/create-key.jpeg)

:::caution
Never commit your service account key to version control. Use environment variables to store `privateKey` and `clientEmail`.
:::

## Step 6: Share your spreadsheet

Share your Google Sheets spreadsheet with the service account email (found in the JSON key file as `client_email`). Give it **Editor** access.
