---
id: sheets-setup
title: Configuracion de la hoja
sidebar_position: 3
---

# Configurar tu hoja de Google Sheets

## Crear una nueva hoja de calculo

Abre [Google Sheets](https://sheets.google.com) y crea una nueva hoja de calculo.

## Estructurar tu hoja

Tu hoja de calculo debe seguir este formato:

| key | en | fr | es |
|-----|----|----|-----|
| greeting | Hello | Bonjour | Hola |
| farewell | Goodbye | Au revoir | Adios |
| nav.home | Home | Accueil | Inicio |
| nav.about | About | A propos | Acerca de |

- **Columna A**: Claves de traduccion (soporta notacion de puntos para anidamiento, por ejemplo `nav.home`)
- **Otras columnas**: Una columna por idioma, con el encabezado de columna como codigo de idioma

![model-sheets](/img/sheets.png)

## Encontrar el ID de tu hoja de calculo

El ID de la hoja de calculo se encuentra en la URL:

```
https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit#gid=0
```

La cadena larga entre `/d/` y `/edit` es el ID de tu hoja de calculo.

## Opcional: Script de traduccion automatica

Puedes agregar un Google Apps Script para traducir texto automaticamente cuando escribes en una columna especifica.

1. Ve a **Extensiones** > **Apps Script**.

   ![script-editor](/img/script-editor.png)

2. Pega el siguiente script:

```javascript
function onEdit(e) {
  if (!e) return;

  var range = e.range;
  var sheet = range.getSheet();
  var row = range.getRow();
  var column = range.getColumn();

  // Se activa en la columna B (columna 2), omite la fila de encabezado
  if (column === 2 && row > 1) {
    translateAndSet(sheet, row, range.getValue());
  }
}

function translateAndSet(sheet, row, text) {
  sheet.getRange(row, 3).setValue(LanguageApp.translate(text, "", "fr"));
  sheet.getRange(row, 4).setValue(LanguageApp.translate(text, "", "es"));
  sheet.getRange(row, 5).setValue(LanguageApp.translate(text, "", "ht"));
}
```

3. Guarda el script y regresa a tu hoja.

Para agregar mas idiomas, agrega una nueva linea en `translateAndSet` con el codigo de idioma y el numero de columna apropiados.

:::tip
Recuerda compartir tu hoja de calculo con la direccion de correo electronico de tu cuenta de servicio.
:::
