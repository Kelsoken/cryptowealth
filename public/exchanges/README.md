# Crypto Exchange Integration Illustrations

Deze map bevat professionele, rechtenvrije SVG-illustraties voor crypto exchange integraties, ontworpen volgens moderne UI/UX principes.

## Bestanden

### Individuele Exchange Illustraties
- **`binance_integration.svg`** - Binance integratie (Geel/Zwart thema)
- **`coinbase_integration.svg`** - Coinbase integratie (Blauw thema)
- **`kraken_integration.svg`** - Kraken integratie (Donkerblauw/Paars thema)
- **`kucoin_integration.svg`** - KuCoin integratie (Lichtblauw thema)
- **`bitvavo_integration.svg`** - Bitvavo integratie (Oranje thema)

### Overzicht Illustratie
- **`integration_overview.svg`** - Overzicht van alle exchanges verbonden in één systeem

## Specificaties

### Stijl
- **Minimalistisch 3D** design
- **Glasmorfisme** effecten (glasachtige transparantie)
- **Zachte schaduwen** voor diepte
- **Helder kleurverloop** voor moderne uitstraling

### Kleurpalet
Elke exchange gebruikt zijn eigen huisstijlkleuren:
- **Binance**: #F3BA2F (Geel) → #F7931A (Oranje)
- **Coinbase**: #0052FF (Blauw) → #1E88E5 (Lichtblauw)
- **Kraken**: #1E3A8A (Donkerblauw) → #7C3AED (Paars)
- **KuCoin**: #23D160 (Groen) → #00B4DB (Lichtblauw)
- **Bitvavo**: #FF6B35 (Oranje) → #F7931E (Goud)

### Technische Details
- **Formaat**: SVG (schaalbaar vector graphics)
- **Achtergrond**: Transparant (.png compatibel)
- **Resolutie**: Oneindig schaalbaar
- **Bestandsgrootte**: Klein (2-5 KB per bestand)

## Gebruik

### Web Integratie
```html
<!-- Individuele exchange -->
<img src="/static/images/exchanges/binance_integration.svg" alt="Binance Integration" />

<!-- Overzicht -->
<img src="/static/images/exchanges/integration_overview.svg" alt="Exchange Integration Overview" />
```

### CSS Styling
```css
.exchange-icon {
    width: 64px;
    height: 64px;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
}

.exchange-icon:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease;
}
```

### React/JavaScript
```jsx
import BinanceIcon from './static/images/exchanges/binance_integration.svg';

function ExchangeCard({ exchange }) {
    return (
        <div className="exchange-card">
            <img src={exchange.icon} alt={`${exchange.name} Integration`} />
            <h3>{exchange.name}</h3>
        </div>
    );
}
```

## Aanpassingen

### Kleuren Wijzigen
Pas de gradient kleuren aan in de `<defs>` sectie van elk SVG bestand:

```xml
<linearGradient id="customGradient" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style="stop-color:#YOUR_COLOR;stop-opacity:1" />
    <stop offset="100%" style="stop-color:#YOUR_SECOND_COLOR;stop-opacity:1" />
</linearGradient>
```

### Grootte Wijzigen
Wijzig de `width` en `height` attributen in de SVG tag, of gebruik CSS:

```css
.exchange-icon {
    width: 128px;  /* 2x groter */
    height: 128px;
}
```

## Licentie

Deze illustraties zijn volledig rechtenvrij en kunnen commercieel gebruikt worden zonder beperkingen.

## Ondersteunde Browsers

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contact

Voor vragen over deze illustraties of aanpassingen, neem contact op met het development team.
