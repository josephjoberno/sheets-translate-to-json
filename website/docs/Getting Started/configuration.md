---

id: configuration
title: Configuration
sidebar_position: 2
---

Creating a service account and obtaining API keys via Google Cloud Console is a multi-step process. Here is a detailed guide to help you navigate these steps. You can add screenshots to each step to make the guide clearer.

### Step 1: Logging into Google Cloud Console

1. **Open your browser and go to [Google Cloud Console](https://console.cloud.google.com/).**
2. **Log in with your Google account.** If you don't have one, you will need to create one.

### Step 2: Creating a New Project

1. **In the Google Cloud Console dashboard, click on the project selector at the top of the page.**
2. **Click on 'New Project'.**
3. **Enter a name for your project, and, if necessary, select an organization.**
4. **Click on 'Create'.**

   ![new-project](/img/creat-project.png)

### Step 3: Creating a Service Account

1. **In the Google Cloud Console navigation menu, go to 'IAM & Admin' > 'Service Accounts'.**
2. **Click on 'Create a service account'.**
3. **Enter a name and description for the service account.**
4. **Click on 'Create'.**

   ![create-service-account](/img/create-service-account.png)

### Step 4: Assigning Roles to the Service Account (Optional)

1. **On the 'Grant this service account access to project' screen, select an appropriate role.** For example, for Google Sheets integration, you might choose 'Sheets Editor'.
2. **Click on 'Continue'.**

### Step 5: Creating the Service Account Key

1. **On the service account details page, click on 'Add key' then 'Create new key'.**
2. **Choose the key format (JSON is recommended) and click on 'Create'.**
3. **A JSON file containing your key will be downloaded to your computer. Keep this file safe.**

  ![details-key](/img/details-key.jpeg)

  ----

  ![add-key](/img/add-key.jpeg)

  ----

  ![create-key](/img/create-key.jpeg)

### Step 6: Enabling Necessary APIs (if needed)

1. **In the navigation menu, go to 'APIs & Services' > 'Library'.**
2. **Search for and enable the APIs needed for your project.** For example, for Google Sheets, search for and enable the Google Sheets API.

![enable-api](/img/enable-api.png)

### Conclusion

You now have a service account with an API key that you can use to authenticate your applications with Google Cloud services. Make sure to keep your key safe and not share it publicly.
