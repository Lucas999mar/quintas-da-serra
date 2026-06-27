
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    const { id } = req.query;

    // Real path to the site data (we can read the js/data.js or just have a copy of the data)
    // For simplicity and speed in a static context, we'll try to find the property details
    // In a real production app, we might use a database here.

    const domain = "https://www.supportimobiliario.com.br";

    // Default values
    let title = "Suporte Imobiliário | Imóveis Exclusivos";
    let description = "Confira este imóvel exclusivo no Suporte Imobiliário. Conforto e segurança em meio à natureza.";
    let image = `${domain}/assets/images/hero-bg.png`;
    let url = `${domain}/?imovel=${id}`;

    try {
        // Try to read the data.js file to find the property
        const dataPath = path.join(process.cwd(), 'js', 'data.js');
        if (fs.existsSync(dataPath)) {
            const content = fs.readFileSync(dataPath, 'utf8');

            // Look for the property object in the source code (regex-based for speed since it's a fixed format)
            // This is a bit hacky but works for static site previews without a DB
            const propRegex = new RegExp(`{\\s*"id"\\s*:\\s*"${id}"[^{}]*}`, 's');
            const match = content.match(propRegex);

            if (match) {
                // Simple extraction of title and location
                const titleMatch = match[0].match(/"title"\s*:\s*"([^"]+)"/);
                const locMatch = match[0].match(/"location"\s*:\s*"([^"]+)"/);
                const priceMatch = match[0].match(/"price"\s*:\s*(\d+)/);
                const imagesMatch = match[0].match(/"images"\s*:\s*\[\s*"([^"]+)"/);

                if (titleMatch) title = titleMatch[1] + " | Suporte Imobiliário";
                if (locMatch) description = `📍 Localização: ${locMatch[1]}. ` + description;
                if (priceMatch && priceMatch[1] > 0) {
                    const price = parseInt(priceMatch[1]).toLocaleString('pt-BR');
                    description = `💰 Valor: R$ ${price}. ` + description;
                }

                if (imagesMatch) {
                    const imgPath = imagesMatch[1];
                    if (imgPath.startsWith('data:')) {
                        // We can't use base64 in meta tags, so we'll fallback to a neutral image 
                        // OR we'd need to save the image to a temporary public URL.
                        // For now, if it's base64, we use the default hero.
                        image = `${domain}/assets/images/house.png`;
                    } else {
                        image = imgPath.startsWith('http') ? imgPath : `${domain}/${imgPath.startsWith('/') ? imgPath.slice(1) : imgPath}`;
                    }
                }
            }
        }
    } catch (err) {
        console.error("Error generating OG tags:", err);
    }

    // Return HTML with OG tags and a redirect to the main site
    res.setHeader('Content-Type', 'text/html');
    res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <meta property="og:type" content="website">
      <meta property="og:url" content="${url}">
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${description}">
      <meta property="og:image" content="${image}">
      <meta property="og:image:width" content="1200">
      <meta property="og:image:height" content="630">
      
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${title}">
      <meta name="twitter:description" content="${description}">
      <meta name="twitter:image" content="${image}">

      <script>
        // Redirect the user to the actual property page
        window.location.href = "${url}";
      </script>
    </head>
    <body>
      <p>Redirecionando para o imóvel...</p>
    </body>
    </html>
  `);
};
