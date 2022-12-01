var fs = require('fs'); 

All_Cards = JSON.parse(fs.readFileSync('get-cards.json'));
// source url: https://fftcg.square-enix-games.com/en/get-cards
// Elements:
    // {f} {i} {w} {e} {l} {a}
    // Costs:
    // {1} {2} {X}
    // Other Icons:
    // {d} dull
    // {x} EX Burst
    // {s} special
    // {c} crystal 
    // Text:
    // Stars (*) for bold
    // Italic
    // %Special Orange%
    // Damage and warp character: ―

fileName = 'MyCards'

FFD_Data = getAllMyCards(All_Cards.cards)


fs.writeFile(`${fileName}.csv`, '\ufeff' + convertToCSV(FFD_Data), { encoding: 'utf8' }, function (err) {if (err) throw err;}) // Excel
fs.writeFile(`${fileName}.json`, JSON.stringify(FFD_Data, null, 2), function (err) {if (err) throw err;}) // JSON


















// ----------------------------------- Helper Functions -------------------------------------------------------------------------------------------------------------------------------------------

function getAllMyCards(All_Cards){
    cardArr = []
    for (i = 0; i < All_Cards.length; i++){
        card = {}
        tempCard = All_Cards[i]
        
        card['name'] = tempCard.Name_NA
        card['category'] = [getCategory(tempCard.Category_1), tempCard.Category_2]
        card['is_ex_burst'] = tempCard.Text_NA.includes('[[ex]]')
        card['power'] = tempCard.Power 
        card['rarity'] = tempCard.Rarity
        card['is_multi_playable'] = tempCard.Multicard
        card['job'] = tempCard.Job_NA.split('/')
        card['cost'] = tempCard.Cost
        card['serial_number'] = tempCard.Code
        card['current_price'] =  {
            "current_price": "",
            "regular_low_price": "",
            "foil_low_price": "",
            "regular_market_price": "",
            "date": "",
            "serial_number": "",
            "foil_market_price": ""
        }
        card['datastore_id'] = ""
        card['type'] = tempCard.Type_NA
        card['elements'] = tempCard.Element
            .replace("火", "Fire")
            .replace("氷", "Ice")
            .replace("風", "Wind")
            .replace("土", "Earth")
            .replace("雷", "Lightning")
            .replace("水", "Water")
            .replace("闇", "Dark")
            .replace("光", "Light").split('/')
        card['octgn_id'] = ""
        card['abilities'] = getAbilities(tempCard.Text_NA)
        card['image'] = tempCard.images.full    

        cardArr.push(card)

    }
    return(cardArr)
}

function getCategory (str){
    cat = str.indexOf('&middot') > 0? str.substring(0, str.toString().indexOf('&middot')-1) : str
    return cat
}

function getAbilities(str){
    abilStr = ""

    abilStr = str
    .replaceAll("《火》", "{f}")
    .replaceAll("《氷》", "{i}")
    .replaceAll("《風》", "{w}")
    .replaceAll("《土》", "{e}")
    .replaceAll("《雷》", "{l}")
    .replaceAll("《水》", "{a}")
    .replaceAll("《ダル》", "{d}")
    .replaceAll("《S》", "{s}")
    .replaceAll("Activate", "*Activate*")
    .replaceAll("Brave", "*Brave*")
    .replaceAll("Haste", "*Haste*")
    .replaceAll("Dull", "*Dull*")
    .replaceAll("Freeze", "*Freeze*")
    .replaceAll("First Strike", "*First Strike*")
    .replaceAll("Back Attack", "*Back Attack*")

    while(abilStr.indexOf("[[i]]") >= 0){
        abilStr = abilStr.replace(
                abilStr.substring(abilStr.indexOf("[[i]]"), abilStr.indexOf("/]]", abilStr.indexOf("[[i]]"))+3),
                '~' + abilStr.substring(abilStr.indexOf("[[i]]")+5, abilStr.indexOf("/]]", abilStr.indexOf("[[i]]"))-3) + '~'
            ) 
    }
    while(abilStr.indexOf("[[s]]") >= 0){
        abilStr = abilStr.replace(
                abilStr.substring(abilStr.indexOf("[[s]]"), abilStr.indexOf("/]]", abilStr.indexOf("[[s]]"))+3),
                '%' + abilStr.substring(abilStr.indexOf("[[s]]")+5, abilStr.indexOf("/]]", abilStr.indexOf("[[s]]"))-3) + '%'
            ) 
    }
    while(abilStr.indexOf("[[ex]]") >= 0){
        abilStr = abilStr.replace(
                abilStr.substring(abilStr.indexOf("[[ex]]"), abilStr.indexOf("/]]", abilStr.indexOf("[[ex]]"))+3),
                '{x}' + abilStr.substring(abilStr.indexOf("[[ex]]")+5, abilStr.indexOf("/]]", abilStr.indexOf("[[ex]]"))-3) + '{x}'
            ) 
    }
    return abilStr.split('[[br]]').map(s => s.trim())
}

function convertToCSV(arr) {
    const array = [Object.keys(arr[0])].concat(arr)
  
    return array.map(it => {
      return Object.values(it).toString()
    }).join('\n')
  }