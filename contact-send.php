<?php
declare(strict_types=1);
session_start();

function ac_redirect(string $status): void {
    $allowed = array('sent', 'failed', 'invalid', 'limited');
    if (!in_array($status, $allowed, true)) {
        $status = 'invalid';
    }
    header('Location: urlaubsanfrage.html?contact=' . rawurlencode($status) . '#contactForm', true, 303);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    ac_redirect('invalid');
}

// Invisible field for automated spam submissions.
if (!empty($_POST['website'])) {
    ac_redirect('sent');
}

$now = time();
$attempts = array_values(array_filter(
    (array) ($_SESSION['ac_contact_attempts'] ?? array()),
    static function ($timestamp) use ($now): bool {
        return is_int($timestamp) && $timestamp > $now - 900;
    }
));
if (count($attempts) >= 5) {
    ac_redirect('limited');
}
$attempts[] = $now;
$_SESSION['ac_contact_attempts'] = $attempts;

function ac_text(string $key, int $maxLength): string {
    $value = trim((string) ($_POST[$key] ?? ''));
    $value = str_replace(array("\r", "\0"), '', $value);
    return function_exists('mb_substr')
        ? mb_substr($value, 0, $maxLength, 'UTF-8')
        : substr($value, 0, $maxLength);
}

$name = ac_text('name', 120);
$email = filter_var(ac_text('email', 190), FILTER_VALIDATE_EMAIL);
$phone = ac_text('phone', 80);
$season = ac_text('season', 40);
$chaletKey = ac_text('chalet', 20);
$arrival = ac_text('arrival', 10);
$departure = ac_text('departure', 10);
$guests = filter_var($_POST['guests'] ?? null, FILTER_VALIDATE_INT, array(
    'options' => array('min_range' => 1, 'max_range' => 20),
));
$message = ac_text('message', 5000);
$name = str_replace("\n", ' ', $name);
$phone = str_replace("\n", ' ', $phone);
$season = str_replace("\n", ' ', $season);
$chaletTypes = array(
    '4-zimmer' => '4-Zimmer-Chalet',
    '5-zimmer' => '5-Zimmer-Chalet',
);
$chalet = $chaletTypes[$chaletKey] ?? '';
$validDates = preg_match('/^\d{4}-\d{2}-\d{2}$/', $arrival)
    && preg_match('/^\d{4}-\d{2}-\d{2}$/', $departure)
    && $arrival >= date('Y-m-d')
    && $departure > $arrival;

if ($name === '' || $email === false || $message === '' || $chalet === '' || !$validDates) {
    ac_redirect('invalid');
}

$recipient = 'info@alpenchalets.at';
$subject = 'Anfrage Alpenchalets Flachau - ' . ($season !== '' ? $season : 'Kontakt');
$body = "Neue Anfrage über alpenchalets.at\n\n";
$body .= "Name: {$name}\n";
$body .= "E-Mail: {$email}\n";
$body .= "Telefon: {$phone}\n";
$body .= "Saison: {$season}\n";
$body .= "Chalet: {$chalet}\n";
$body .= "Anreise: {$arrival}\n";
$body .= "Abreise: {$departure}\n";
$body .= 'Personen: ' . ($guests !== false && $guests !== null ? $guests : 'nicht angegeben') . "\n\n";
$body .= "Nachricht:\n{$message}\n";

$headers = array(
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: Flachauer Alpenchalets <info@alpenchalets.at>',
    'Reply-To: ' . $name . ' <' . $email . '>',
);
$encodedSubject = function_exists('mb_encode_mimeheader')
    ? mb_encode_mimeheader($subject, 'UTF-8')
    : $subject;

ac_redirect(mail($recipient, $encodedSubject, $body, implode("\r\n", $headers)) ? 'sent' : 'failed');
