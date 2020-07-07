<?php
header('Content-Type: application/json');

function isInArray($data, $code) {
  if(in_array ($code, $data)){
    return true;
  } else {
    return false;
  }
}

function validCode($code) {
$ch = curl_init();
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'secret-key: $2b$10$HAgDipUoZoeHPuuSIeQawOUij4d.8ljroeQ8pYwCyspWdWzHC1Elm',
));
curl_setopt($ch, CURLOPT_URL, "https://api.jsonbin.io/b/5f04aaf5a62f9b4b27609f4f");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$data = json_decode(curl_exec($ch),true);
$curl_errno = curl_close($ch);
if ($curl_errno == 0) {
  return isInArray($data, $code);
}
return false;
}

function editJSON($data, $code) {
  $data = json_encode(array_values(array_diff($data, [$code])));
  $ch = curl_init("https://api.jsonbin.io/b/5f04aaf5a62f9b4b27609f4f");
  curl_setopt($ch, CURLOPT_HTTPHEADER, array(
      'secret-key: $2b$10$HAgDipUoZoeHPuuSIeQawOUij4d.8ljroeQ8pYwCyspWdWzHC1Elm',
      'Content-Type: application/json',
      'versioning: false'
  ));
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
  curl_setopt($ch, CURLOPT_POSTFIELDS,$data);

  $response = curl_exec($ch);
  if (!$response)
  {
      return false;
  }
  return true;
}

function removeCode($code) {
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_HTTPHEADER, array(
      'secret-key: $2b$10$HAgDipUoZoeHPuuSIeQawOUij4d.8ljroeQ8pYwCyspWdWzHC1Elm',
  ));
  curl_setopt($ch, CURLOPT_URL, "https://api.jsonbin.io/b/5f04aaf5a62f9b4b27609f4f");
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  $data = json_decode(curl_exec($ch),true);
  $curl_errno = curl_close($ch);
  if ($curl_errno == 0) {
    return editJSON($data, $code);
  }
}

removeCode("f2ZcyiwUd0fRnD1");

$aResult = array();

 if( !isset($_POST['functionname']) ) { $aResult['error'] = 'No function name!'; }

 if( !isset($_POST['arguments']) ) { $aResult['error'] = 'No function arguments!'; }

 if( !isset($aResult['error']) ) {
   switch($_POST['functionname']) {
     case 'validCode':
       if( !is_array($_POST['arguments']) || (count($_POST['arguments']) != 1)) {
          $aResult['error'] = 'Error in arguments!';
        } else {
            $aResult['result'] = validCode(($_POST['arguments'][0]));
        }
      break;
     case 'removeCode':
        if( !is_array($_POST['arguments']) || (count($_POST['arguments']) != 1)) {
          $aResult['error'] = 'Error in arguments!';
        } else {
          $aResult['result'] = removeCode(($_POST['arguments'][0]));
        }
      break;
     default:
        $aResult['error'] = 'Not found function '.$_POST['functionname'].'!';
      break;
   }
  echo json_encode($aResult);
}
?>
