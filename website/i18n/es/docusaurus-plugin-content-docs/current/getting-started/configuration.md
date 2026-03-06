---
id: configuration
title: Configuracion
sidebar_position: 2
---

# Configuracion de Google Cloud

Para usar `sheets-translate-to-json`, necesitas una cuenta de servicio de Google Cloud con acceso a la API de Google Sheets.

## Paso 1: Crear un proyecto de Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/).
2. Haz clic en el selector de proyectos en la parte superior y luego en **Nuevo Proyecto**.
3. Ingresa un nombre para el proyecto y haz clic en **Crear**.

![new-project](/img/creat-project.png)

## Paso 2: Habilitar la API de Google Sheets

1. En el menu de navegacion, ve a **APIs y Servicios** > **Biblioteca**.
2. Busca **Google Sheets API** y haz clic en **Habilitar**.

![enable-api](/img/enable-api.png)

## Paso 3: Crear una cuenta de servicio

1. Ve a **IAM y Administracion** > **Cuentas de servicio**.
2. Haz clic en **Crear cuenta de servicio**.
3. Ingresa un nombre y una descripcion, luego haz clic en **Crear y Continuar**.

![create-service-account](/img/create-service-account.png)

## Paso 4: Asignar roles (opcional)

1. Selecciona un rol apropiado (por ejemplo, **Editor**).
2. Haz clic en **Continuar** y luego en **Listo**.

## Paso 5: Crear una clave JSON

1. Haz clic en tu cuenta de servicio y luego ve a la pestana **Claves**.
2. Haz clic en **Agregar clave** > **Crear nueva clave**.
3. Selecciona **JSON** y haz clic en **Crear**.
4. Se descargara un archivo JSON. **Guardalo de forma segura.**

![details-key](/img/details-key.jpeg)

---

![add-key](/img/add-key.jpeg)

---

![create-key](/img/create-key.jpeg)

:::caution
Nunca subas tu clave de cuenta de servicio al control de versiones. Usa variables de entorno para almacenar `privateKey` y `clientEmail`.
:::

## Paso 6: Compartir tu hoja de calculo

Comparte tu hoja de calculo de Google Sheets con el correo electronico de la cuenta de servicio (que se encuentra en el archivo de clave JSON como `client_email`). Dale acceso de **Editor**.
