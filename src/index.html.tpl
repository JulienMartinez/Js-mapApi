<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Mapbox événement</title>
</head>
<body>
<div id="main-map"></div>
    <div class="side-panel">
        <h1>Mapbox événement</h1>
        <form action="" method="post" class="container">
            <div class="champ">
                <label for="title">Nom de l'événement:</label>
                <input type="text" id="title" name="title">
            </div>
            <div class="champ">
                <label for="description">Description de l'événement:</label>
                <textarea name="description" id="description" cols="30" rows="5"></textarea>
            </div>
            <div class="champ">
                <label for="date-start">Dates de début:</label>
                <input type="datetime-local" id="date-start" name="date-start">
            </div>
            <div class="champ">
                <label for="date-end">Dates de fin:</label>
                <input type="datetime-local" id="date-end" name="date-end">
            </div>
            <div class="champ">
                <label for="long">Longitude:</label>
                <input type="number" id="long" name="long" step="0.0000000000000001">
            </div>
            <div class="champ">
                <label for="lat">Latitude:</label>
                <input type="number" id="lat" name="lat" step="0.0000000000000001">
            </div>
            <div class="champ">
                <button type="submit" class="btn">Ajouter</button>
            </div>
        </form>
    </div>
</body>
</html>