<?php
require_once __DIR__ . '/autoload.php';
use App\Serializer;
use App\Encoder\JsonEncoder;
use App\Encoder\YamlEncoder;
use App\Encoder\CsvEncoder;

$serializer = new Serializer([
        new JsonEncoder(),
        new YamlEncoder(),
        new CsvEncoder('csv', ','),
        new CsvEncoder('ssv', ';'),
        new CsvEncoder('tsv', "\t")
]);

$input = $_POST['input'] ?? $_COOKIE['last_input'] ?? '';
$from = $_POST['from'] ?? $_COOKIE['last_from'] ?? 'csv';
$to = $_POST['to'] ?? $_COOKIE['last_to'] ?? 'json';
$output = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $output = $serializer->convert($input, $from, $to);

    setcookie('last_input', $input, time() + 3600);
    setcookie('last_from', $from, time() + 3600);
    setcookie('last_to', $to, time() + 3600);
}
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Konwerter PTW - LAB F</title>
</head>
<body>

<h1>Konwerter danych</h1>

<form method="post">

    <table border="1" cellpadding="10">
        <tr>
            <td valign="top">
                <label>Dane wejściowe:</label><br>
                <textarea name="input" rows="20" cols="50"><?= htmlspecialchars($input) ?></textarea>
            </td>

            <td valign="top">
                <label>Wynik:</label><br>
                <pre><?= htmlspecialchars($output) ?></pre>
            </td>
        </tr>
    </table>

    <br>

    <label>Z:</label>
    <select name="from">
        <option value="csv" <?= $from=='csv'?'selected':'' ?>>CSV (przecinek)</option>
        <option value="ssv" <?= $from=='ssv'?'selected':'' ?>>SSV (średnik)</option>
        <option value="tsv" <?= $from=='tsv'?'selected':'' ?>>TSV (tabulator)</option>
        <option value="json" <?= $from=='json'?'selected':'' ?>>JSON</option>
        <option value="yaml" <?= $from=='yaml'?'selected':'' ?>>YAML</option>
    </select>

    <label>Na:</label>
    <select name="to">
        <option value="csv" <?= $to=='csv'?'selected':'' ?>>CSV (przecinek)</option>
        <option value="ssv" <?= $to=='ssv'?'selected':'' ?>>SSV (średnik)</option>
        <option value="tsv" <?= $to=='tsv'?'selected':'' ?>>TSV (tabulator)</option>
        <option value="json" <?= $to=='json'?'selected':'' ?>>JSON</option>
        <option value="yaml" <?= $to=='yaml'?'selected':'' ?>>YAML</option>
    </select>

    <button type="submit">Convert</button>

</form>

</body>
</html>
