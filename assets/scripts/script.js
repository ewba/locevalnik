$(function() {
  // smooth scrolls to the location of the clicked link
  $('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top - 50
        }, 1000);
        return false;
      }
    }
  })

  // refresh the data and setup the display if needed
  function getData() {
    $("#rezultat").css({
      "opacity":"1",
      "height":"100%",
      "padding":"10px 20px 20px 20px"
    });

    $.get(
      "extract.php",
      { x: $("#obc").val(), tip: $("#odp").val() },
      function(data){
        //console.log(data)
        if (data.kam) {
          $('#rezultat').html(data.kam);
        } else if (data.error) {
          $('#rezultat').html(data.error);
        } else {
          $('#rezultat').html("<h2>Prišlo je do interne napake! Prosim sporočite iskalne besede na bofh@ebm.si.</h2>");
        }
      },
      "json"
    );
  }

  // fetch data on input change
  $('#obc, #odp').on("change", function () {
    // only trigger when both inputs have something in them
    const triggerLength = 2;
    if ($("#obc").val().length > triggerLength
        && $("#odp").val().length > triggerLength) {
        getData();
    }
  });

  const objBlob = ["Ankaran","Apače", "Beltinci", "Cankova", "Črenšovci", "Dobrovnik", "Gornja Radgona", "Gornji Petrovci", "Grad", "Hodoš", "Križevci", "Kobilje", "Kuzma", "Lendava", "Ljutomer", "Moravske Toplice", "Murska Sobota", "Odranci", "Puconci", "Radenci", "Razkrižje", "Rogaševci", "Sveti Jurij ob Ščavnici", "Šalovci", "Tišina", "Turnišče", "Velika Polana", "Veržej", "Benedikt", "Cerkvenjak", "Duplek", "Hoče - Slivnica", "Kungota", "Lenart", "Lovrenc na Pohorju", "Makole", "Maribor", "Miklavž na Dravskem polju", "Pesnica", "Poljčane", "Rače - Fram", "Ruše", "Selnica ob Dravi", "Slovenska Bistrica", "Sveta Ana", "Sveta Trojica v Slovenskih goricah", "Sveti Jurij v Slovenskih goricah", "Starše", "Šentilj", "Črna na Koroškem", "Dravograd", "Mežica", "Mislinja", "Muta", "Podvelka", "Prevalje", "Radlje ob Dravi", "Ravne na Koroškem", "Ribnica na Pohorju", "Slovenj Gradec", "Vuzenica", "Bistrica ob Sotli", "Celje", "Dobje", "Kozje", "Laško", "Oplotnica", "Podčetrtek", "Rogaška Slatina", "Rogatec", "Slovenske Konjice", "Šentjur pri Celju", "Šmarje pri Jelšah", "Štore", "Vitanje", "Vojnik", "Zreče", "Braslovče", "Dobrna", "Gornji Grad", "Ljubno", "Luče", "Mozirje", "Nazarje", "Polzela", "Prebold", "Rečica ob Savinji", "Solčava", "Šoštanj", "Šmartno ob Paki", "Tabor", "Velenje", "Vransko", "Žalec", "Brežice", "Kostanjevica na Krki", "Krško", "Sevnica", "Hrastnik", "Radeče", "Trbovlje", "Zagorje ob Savi", "Črnomelj", "Dolenjske Toplice", "Metlika", "Mirna peč", "Mokronog - Trebelno", "Novo mesto", "Semič", "Straža", "Šentjernej", "Šentrupert", "Škocjan", "Šmarješke Toplice", "Trebnje", "Žužemberk", "Kočevje", "Kostel", "Loški Potok", "Osilnica", "Ribnica", "Sodražica", "Velike Lašče", "Dobrepolje", "Grosuplje", "Ivančna Gorica", "Dol pri Ljubljani", "Domžale", "Ig", "Kamnik", "Komenda", "Litija", "Ljubljana", "Lukovica", "Medvode", "Mengeš", "Moravče", "Škofljica", "Šmartno pri Litiji", "Trzin", "Vodice", "Bled", "Bohinj", "Cerklje na Gorenjskem", "Gorenja vas - Poljane", "Gorje", "Jesenice", "Jezersko", "Kranj", "Kranjska Gora", "Naklo", "Preddvor", "Radovljica", "Šenčur", "Škofja Loka", "Tržič", "Železniki", "Žiri", "Žirovnica", "Bloke", "Brezovica", "Borovnica", "Cerknica", "Dobrova - Polhov Gradec", "Horjul", "Log - Dragomer", "Logatec", "Loška Dolina", "Vrhnika", "Ajdovščina", "Bovec", "Brda", "Cerkno", "Idrija", "Kanal ob Soči", "Kobarid", "Miren - Kostanjevica", "Nova Gorica", "Renče - Vogrsko", "Šempeter - Vrtojba", "Tolmin", "Vipava", "Divača", "Hrpelje - Kozina", "Ilirska Bistrica", "Komen", "Pivka", "Postojna", "Sežana", "Izola", "Koper", "Piran", "Cirkulane", "Destrnik", "Dornava", "Gorišnica", "Hajdina", "Juršinci", "Kidričevo", "Majšperk", "Markovci", "Ormož", "Ptuj", "Podlehnik", "Središče ob Dravi", "Sveti Andraž v Slovenskih goricah", "Sveti Tomaž", "Trnovska vas", "Videm", "Zavrč", "Žetale","Mirna"]

  $("#obc").typeahead({source: objBlob})


  const odpBlob = ["ALU folija", "ALU pločevinke", "Aerosolni sprej pločevinke", "Agrumi (sadje)", "Akumulatorji", "Alkalije", "Ampule (steklene)", "Azbestna kritina", "Barve, laki", "Baterije", "Bencin, kurilno olje, špirit, tekoča goriva", "Blister (ovoj za tablete)", "Božično drevesce (les)", "Božično drevesce (umetno)", "Brošure", "Celofan", "Cigaretne škatlice - papir", "Cigaretni ogorki, pepel, čiki", "CD (zgoščenka)", "CD - plastičen ovitek", "CD - papirnat ovitek", "Cvetje (drevje, rože)", "DVD (zgoščenka)", "Elastika, gumica", "Elektronska oprema", "Steklena embalaža", "Fiole (plastične)", "Fiole (steklene)", "Fluorescentne cevi in sijalke","Folije (salam itd.)", "Foto albumi", "Fotografije in negativi", "Gradbeni odpadki iz gospodinjstev (opeka, ploščice, beton)", "Igrače brez baterij", "Izolacijski material", "Iztrebki malih živali (v vrečki)", "Jajčne lupine, jajca", "Jedilna olja (olivno, sončnično, bučno ...)", "Jogurtovi lončki", "Karton", "Kartonska embalaža - tetrapak", "Kartonska embalaža za jajca", "Kartuše, tonerji", "Kaseta (radio)", "Katalogi - papirnati", "Kavni usedki", "Kemikalije", "Keramika", "Kisline", "Knjižne platnice (TRDE)", "Knjižne platnice (karton)", "Strani knjig, učbenikov", "Konzerve", "Kosti (drobne)", "Kosti (večje)", "Kozarec - papirnat", "Kozarec - plastičen", "Kozarec - steklen", "Kozmetika (ličila, kreme, šamponi, deodoranti, mila, šminke)", "Lasje, nohti", "Lepenka", "Lepilo", "Lestenci", "Likalnik", "Listje", "Lončki (jogurtov, namazov itd.)", "Mačja stelja, iztrebki", "Meso in mesni izdelki", "Mobilni telefoni, GSM, mobiteli", "Motorna olja", "Nahrbtnik", "Novoletne lučke", "Obleke, majice, puloverji, hlače, krila, jakne, plašči", "Obrezine z vrta", "Obrezine žive meje", "Odeja", "Odsluženo (motorno) vozilo, avtomobil", "Okraski in spominki", "Olupki sadja in zelenjave", "Ostanki hrane (NE meso)", "Osvežilci zraka", "Ovitek (od masla itd.)", "Ovojni papir", "Papir (peko)", "Papir (plastificiran)", "Papir", "Papirnate vrečke", "Papirnati prtički", "Pepel (drva)", "Pepel (premogov)", "Peresnice", "Pesticidi", "Pisala (kuliji, flomastri, markerji)", "Pisarniški material", "Plastenke (PET)", "Plastična embalaža čistil", "Plastična posoda", "Plastične folije", "Plastične vrečke", "Plenice", "Plenice", "Plevel", "Pločevinke (pijača, konzerve)", "Pluta (zamaški)", "Pnevmatike (avtomobilske zračnice), gume", "Pnevmatike (kolesarske zračnice), gume", "Pokrovi - kovinski", "Plastični pokrovi, zamaški", "Pomije", "Posoda - emajlirana", "Radio", "Računalnik", "Reklamni letaki", "Revije", "Rože", "Sadje", "Sanitarni odpadki", "Steklenice - razbito", "Steklenice", "Stekleničke (parfumov)", "Steklo - (ravno)", "Stiropor", "Tapete", "Tekstil - neuporaben", "Televizija, TV, ekran, monitor", "Termometri", "Tesnila", "Tetrapak", "Tiskalnik", "Topila", "Trava", "Tube (zobne paste, kreme itd.)", "Uporabljeni higienski izdelki", "Vata", "Vatirane palčke", "Veje", "Vileda", "Zavese", "Zdravila, tablete", "Zelenjava", "Zemlja lončnic", "Zobna ščetka", "Zvezki", "Čajne filter vrečke", "Časopis", "Čevlji, škornji, copati (uporabni)", "Čistila, pralni praški", "Škatlica (zdravil, kozmetike itd.)", "Šolske in druge torbe", "Žaganje", "Žarnice - steklene", "Žarnice - varčne", "Žeblji, vijaki, matice, vzmeti", "Živalska dlaka", "Žvečilni gumiji", "Zeleni odrez", "Salonitke", "Valovitke", "Pomaranča", "Limona", "Aluminij", "Kovinska folija", "Avtomobilski akumulator", "Lugi", "Maziva, WD40, Antifriz", "Gospodinjski aparati, bela tehnika", "Maziva, WD40, Antifriz", "Gospodinjski aparati, bela tehnika", "Hladilnik, zmrzovalnik, grelec za vodo", "Štedilnik, pečica, multipraktik, mešalnik", "Plastični lonček", "Papirnati lonček", "Salame, zrezki, surovo meso", "Kape, rokavice, šali"]

  $("#odp").typeahead({source: odpBlob})

})
