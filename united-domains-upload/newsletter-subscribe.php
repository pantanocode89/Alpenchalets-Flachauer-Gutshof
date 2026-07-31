<?php
declare(strict_types=1);
session_start();

function newsletter_redirect(string $status): void {
    $allowed = array('success', 'invalid', 'unavailable', 'failed');
    if (!in_array($status, $allowed, true)) {
        $status = 'failed';
    }
    $path = 'index.html';
    $referer = $_SERVER['HTTP_REFERER'] ?? '';
    if ($referer !== '') {
        $candidate = basename((string) parse_url($referer, PHP_URL_PATH));
        if (preg_match('/^[a-z0-9-]+\.html$/i', $candidate)) {
            $path = $candidate;
        }
    }
    header('Location: ' . $path . '?newsletter=' . rawurlencode($status) . '#newsletter', true, 303);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST' || !empty($_POST['website'])) {
    newsletter_redirect(!empty($_POST['website']) ? 'success' : 'invalid');
}

$email = filter_var(trim((string) ($_POST['email'] ?? '')), FILTER_VALIDATE_EMAIL);
$consent = ($_POST['consent'] ?? '') === 'yes';
if ($email === false || !$consent) {
    newsletter_redirect('invalid');
}

$now = time();
$attempts = array_values(array_filter(
    (array) ($_SESSION['newsletter_attempts'] ?? array()),
    static fn($timestamp): bool => is_int($timestamp) && $timestamp > $now - 900
));
if (count($attempts) >= 5) {
    newsletter_redirect('failed');
}
$attempts[] = $now;
$_SESSION['newsletter_attempts'] = $attempts;

$configFile = __DIR__ . '/newsletter-config.php';
if (!is_file($configFile)) {
    newsletter_redirect('unavailable');
}
$config = require $configFile;
$apiKey = (string) ($config['brevo_api_key'] ?? '');
$listId = (int) ($config['brevo_list_id'] ?? 0);
$templateId = (int) ($config['brevo_doi_template_id'] ?? 0);
$redirectUrl = (string) ($config['confirmation_redirect_url'] ?? '');
if ($apiKey === '' || $listId < 1 || $templateId < 1 || !filter_var($redirectUrl, FILTER_VALIDATE_URL)) {
    newsletter_redirect('unavailable');
}

$payload = json_encode(array(
    'email' => $email,
    'includeListIds' => array($listId),
    'templateId' => $templateId,
    'redirectionUrl' => $redirectUrl,
), JSON_UNESCAPED_SLASHES);

$ch = curl_init('https://api.brevo.com/v3/contacts/doubleOptinConfirmation');
curl_setopt_array($ch, array(
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 12,
    CURLOPT_HTTPHEADER => array(
        'accept: application/json',
        'content-type: application/json',
        'api-key: ' . $apiKey,
    ),
    CURLOPT_POSTFIELDS => $payload,
));
curl_exec($ch);
$httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

newsletter_redirect($httpCode >= 200 && $httpCode < 300 ? 'success' : 'failed');
