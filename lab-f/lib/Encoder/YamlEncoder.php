<?php
namespace App\Encoder;
class YamlEncoder implements EncoderInterface {
    public function supports(string $format): bool { return $format === 'yaml'; }
    public function decode(string $data): array { return yaml_parse($data) ?? []; }
    public function encode(array $data): string { return yaml_emit($data); }
}