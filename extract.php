<?php
// echo "<meta http-equiv='Content-type' content='text/html; charset=utf-8'>";

setlocale (LC_ALL, 'sl_SI.UTF-8');
$dataFolder = "assets/data/";

$destinacije = array("v zabojnik za steklo", "v zabojnik za papir", "v zabojnik za embalažo / plastiko", "v zabojnik za bio odpadke", "v zabojnik za kovine", "v zabojnik za mešane odpadke", "med nevarne odpadke", "na kosovni odvoz", "v zbirni center");

// vrne največji kategorijo z največjim procentom in ali je v tej komunali drugače
function getStats($oid, $dest) {
  global $destinacije,$dataFolder;

  $frel = fopen($dataFolder.'cat-shares.csv', 'r');
  if (! $frel) {
    echo "Ne morem odpreti datoteke!! Pišite na bofh@ebm.si!";
    fclose($frel);
    return array(0=>"0", 1=>"NAPAKA", 2=>0);
  }
  $i = 1;
  $scline = array();
  while(($cline = fgetcsv($frel, 10000, ",")) !== FALSE) {
    if ($i == $oid) {
      $proc = max($cline);
      $scline = $cline;
      break;
    }
    $i++;
  }
  fclose($frel);

  $kam = array_search($proc, $scline);
  $kam = $destinacije[$kam];

  $outlier = 0;
  if ($kam != $dest) $outlier = 1;
  $proc = round($proc, 0);

  return array(0=>"$proc", 1=>"$kam", 2=>$outlier);
}

function getStatsDesc($oid, $dest = -1) {
  if ($dest == -1) {
    $stats = getStats($oid, $dest);
    return "V večini ($stats[0]%) komunal sodi $stats[1]!<br/>";
  }

  $stats = getStats($oid, $dest);
  if ($stats[2] == 1) {
	  return "Drugam kot v večini ($stats[0]%) komunal, kjer sodi $stats[1]!<br/>";
  } else {
	  return "Kot v večini ($stats[0]%) komunal.<br/>";
  }
}

function getSpecialDesc($file, $mode = "") {
  global $cpname;

  $desc = "";
  while(($cline = fgetcsv($file, 1000, ",")) !== FALSE) {
    if (strcmp(strtoupper(trim(preg_replace('/[^-A-Za-z ,)(.]*/','', $cline[0]))), strtoupper($cpname))) continue;

    $nacin = $cline[2];
    $stroski = $cline[3];
    $pogoji = $cline[4];
    $zc = $cline[5];
    $naslov1 = $cline[6];
    $casi1 = $cline[7];
    $link = $cline[8];

    $pogoji = "<span class='izjema-item'>Pogoji za brezplačno oddajo:</span> $pogoji<br>";
    $pogoji = str_replace("m3", "m<sup>3</sup>", $pogoji);
    if ($stroski == 0) $stroski = "Da.";
    if ($stroski == 1) $stroski = "V omejenih količinah.";
    if ($stroski == 2) {
      $stroski = "Ne.";
      $pogoji = "";
    }

    if (strpos($nacin, "center") !== FALSE) {
      $desc = <<<EEE
<span class='izjema-item'>Zbirni center:</span> <a href="$link" target="_blank" rel="noopener">$zc</a>, $naslov1<br>
<span class='izjema-item'>Odpiralni čas:</span> $casi1<br>
<span class='izjema-item'>Brezplačna oddaja?</span> $stroski<br>
$pogoji<br>
EEE;
    }

    if ($mode == "drugi") {
      $zc2 = $cline[9];
      $naslov2 = $cline[10];
      $casi2 = $cline[11];
      if ($zc2 != "n/a") {
        $desc .= <<<EEE
<span class='izjema-item'>Drugi obrat:</span> $zc2, $naslov2<br>
<span class='izjema-item'>Odpiralni čas:</span> $casi2<br><br>
EEE;
      }
    }

    if (strpos($nacin, "akcij") !== FALSE) {
      $desc .= "Vsaj enkrat letno poteka akcija odvoza. ";
    }

    if (strpos($nacin, "naročil") !== FALSE) {
      $desc .= "Odvoz lahko tudi naročite.";
    }

    break;
  }
  return $desc;
}

$pname = trim($_GET["x"]); //obcina
$ptip = trim($_GET["tip"]); //odpadek
$cpname = preg_replace('/[^-A-Za-z ]*/','', $pname);
$cptip = preg_replace('/[^-A-Za-z ,)(]*/','', $ptip);
// var_dump($_GET);

if (empty($cptip)) {
  echo json_encode(array("error"=>"Ni zadetkov.")); // |$cpname|$cptip|
  exit;
}

// preberi vse podatke
$komunale = file_get_contents($dataFolder . 'komunale.json');
if ($komunale) $komunale = json_decode($komunale);
$fmap = fopen($dataFolder.'komunale-za-obmap.csv', 'r');
$fstev = fopen($dataFolder.'odpadki.ostevilceni.csv', 'r');
$kosovni = fopen($dataFolder . 'kosovni.csv', 'r');
$gradbeni = fopen($dataFolder . 'gradbeni.csv', 'r');
if (! $komunale || ! $fmap || !$fstev || !$kosovni || !$gradbeni) {
  echo "Ne morem odpreti datoteke!! Pišite na bofh@ebm.si!";
  fclose($fmap);
  fclose($fstev);
  fclose($kosovni);
  fclose($gradbeni);
  exit;
}

// pogruntaj komunalo
$komunala = "";
$izjema = 0;
while(($cline = fgetcsv($fmap, 1000, ",")) !== FALSE) {
  if (! strcmp(strtoupper(trim(preg_replace('/[^-A-Za-z ,)(.]*/','', $cline[0]))), strtoupper($cpname))) {
    $komunala = trim($cline[1]);
    $ckomunala = trim(preg_replace('/[^-A-Za-z ,)(.]*/','',$cline[1]));

    if(isset($cline[2])) $izjema = $cline[2];
    break;
  }
}

//FIXME: PREGLEDAL DO JP TREBNJE

// pogruntaj id odpadka
$oid = "";
$i = 1;
$posebnost = "";
while(($cline = fgetcsv($fstev, 1000, ",")) !== FALSE) {
  if (strtoupper(preg_replace('/[^-A-Za-z ,)(]*/','', trim($cline[1]))) == strtoupper($cptip)) {
//  	 echo  "$cline[0]|$cline[1]|$i||<br>";
    $oid = $cline[0];
    $posebnost = $cline[2];
    break;
  }
  $i=$i+1;
}
// echo  "$cpname|$komunala|$oid<br>";


if (empty($ckomunala)) {
  $msg = "Manjkajo podatki komunalnega podjetja za $pname. ";
  $msg .= getStatsDesc($oid);
  echo json_encode(array("error"=> "$msg"));
  fclose($fmap);
  fclose($fstev);
  fclose($kosovni);
  fclose($gradbeni);
  exit;
}

if ($izjema != 0) {
  $msg = getStatsDesc($oid);
  $msg .= "<br/>Komunalno podjetje '$komunala', ki pokriva občino $pname ima zelo poseben sistem zbiranja odpadkov, ki tu ne more biti primerno prikazan. Podatke boste dobili na njihovi spletni strani ali po telefonu.";
    echo json_encode(array("error"=>"$msg"));
  fclose($fmap);
  fclose($fstev);
  fclose($kosovni);
  fclose($gradbeni);
  exit;
}


$found = 0;
foreach($komunale as $naziv => $podatki) {
  if (strtoupper(preg_replace('/[^-A-Za-z ,)(.]*/','', trim($naziv))) == strtoupper($ckomunala)) {
    $opombe = preg_replace('/\n/', '</div><div class="item">', $podatki->{"koši"});

    // razbij odpadke (o1:8 o2:6 o3:3 o4:5)
    // dodatni presledki, da " ne konča kot del prvega/zadnjega elementa
    $odpadki = explode(" ", " " . $podatki->{"odpadki"} . " ");
    $spletna = $podatki->{"spletna"} ;
    // najdi $ptip v $odpadki in pretvori v 0-8 indeks za kam
    $odpadek = $odpadki[$oid]; // npr. o1:8
    $odpadek = $odpadek[strlen($odpadek)-1]; // npr. 8
    if (empty($destinacije[$odpadek])) break;
    $kam = "<strong>Odpadek '$ptip' sodi $destinacije[$odpadek].</strong> ";
    $kam .= getStatsDesc($oid, $destinacije[$odpadek]);
    // gradbeni odpadki (posebej označeni) ali kosovni (vsi, ki jih zbirajo preko kosovnega odvoza)
    if (!empty($posebnost) || $odpadek == 7) {
      // gradbeni imajo prednost, če je kdo slučajno označil oboje hkrati
      if ($posebnost == "gradbeni") {
        $opombe = getSpecialDesc($gradbeni, "drugi");
      } else {
        $opombe = getSpecialDesc($kosovni);
      }
      $opombe = '<div class="item">' . $opombe . '</div>';
      $kam = "$kam<div class='alert alert-info'><h3 class='alert-heading'>Informacije glede oddaje</h3>$opombe</div>";
    } else if (!empty($opombe)) {
      $opombe = '<div class="item">' . $opombe . '</div>';
      $kam = "$kam<div class='alert alert-info'><h3 class='alert-heading'>Vrste zabojnikov / način zbiranja odpadkov [<a href='$spletna' rel='noopener'>spletna stran</a>]</h3>$opombe</div>";
    }

    echo json_encode(array("name"=>"$ptip",
      "kam"=>"$kam", 
      "error"=>""));
    $found=1;
    break;
  }
}
if ($found === 0) {
    $msg = "<strong>Manjkajo podatki</strong> komunalnega podjetja '$komunala', ki pokriva občino $pname. Podatke boste dobili na njihovi <a href='$spletna'>spletni strani ali po telefonu</a>.";
    echo json_encode(array("error" => "$msg"));
//  exit;
}

//echo "eeee: $i";
fclose($fmap);
fclose($fstev);
fclose($kosovni);
fclose($gradbeni);

?>
