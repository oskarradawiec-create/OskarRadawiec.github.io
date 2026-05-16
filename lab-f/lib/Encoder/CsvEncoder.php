<?php
namespace App\Encoder;
class CsvEncoder implements EncoderInterface {
    private string $delimiter;
    private string $format;
    public function __construct(string $format, string $delimiter) {
        $this->format = $format;
        $this->delimiter = $delimiter;
    }
    public function supports(string $format): bool {
        return $format === $this->format;
    }
    public function decode(string $data): array {
        $lines = explode("\n", trim($data));
        if (empty($lines)) return [];
        $headers = str_getcsv(array_shift($lines), $this->delimiter, "\"", "\\");
        $result = [];
        foreach ($lines as $line) {
            $row = str_getcsv($line, $this->delimiter, "\"", "\\");
            if (count($headers) === count($row)) {
                $result[] = array_combine($headers, $row);
            }
        }
        return $result;
    }
    public function encode(array $data): string {
        if (empty($data)) return "";
        $output = fopen('php://temp', 'r+');
        fputcsv($output, array_keys($data[0]), $this->delimiter, "\"", "\\");
        foreach ($data as $row) {
            fputcsv($output, $row, $this->delimiter, "\"", "\\");
        }
        rewind($output);
        $content = stream_get_contents($output);
        fclose($output);
        return trim($content);
    }
}
