<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Callow Business Card</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            background-color: #f9f9f9;
        }

        .card {
            width: 90mm;
            height: 50mm;
            margin: 10px;
            border: 2px solid transparent;
            border-image: linear-gradient(90deg, #0066cc, #66b2ff);
            border-image-slice: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 10px;
            box-sizing: border-box;
            background: #fff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .card h1 {
            font-size: 1.5em;
            color: #0066cc;
            margin: 0;
        }

        .card p {
            font-size: 0.9em;
            margin: 5px 0;
            color: #333;
        }

        .card .highlight {
            font-weight: bold;
            color: #0066cc;
        }

        .back {
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .back p {
            font-size: 1.2em;
            color: #0066cc;
        }
    </style>
</head>
<body>

    <!-- Front of the card -->
    <div class="card">
        <h1>Callow</h1>
        <p>Your Go-To Stationery Store</p>
        <p><span class="highlight">Website:</span> <a href="http://www.callow.in">www.callow.in</a></p>
        <p><span class="highlight">WhatsApp:</span> +91 72028 68675</p>
        <p><span class="highlight">Contact:</span> Reach us anytime for affordable and diverse stationery!</p>
        <p>Simple. Affordable. Reliable.</p>
        <p><span class="highlight">50% off</span> your first order with code <span class="highlight">WELCOME50</span>.</p>
    </div>

    <!-- Back of the card -->
    <div class="card back">
        <p>Callow - Your Go-To Stationery Store</p>
        <p>Visit: <a href="http://www.callow.in">www.callow.in</a></p>
        <p>WhatsApp: +91 72028 68675</p>
    </div>

</body>
</html>
