// const name = MosGU schedule addition extension
const version = 0.2
// const description = Shows additional info in MosGU schedule
const author = 'xMAXIMx'

var manualInitTimeout = setTimeout(function tick() {setup()}, 3000);

function convertMudaksDate(date){
  let startSplit = date.split('.')
  if (startSplit[2].length == 2){
    startSplit[2] = `20${startSplit[2]}`
    date = startSplit.join('.')
  }
  return date
}
function setup(){
  console.log(`MosGU schedule addition extension loading\nAuthor - https://t.me/${author}\nVerion - ${version}`)
  clearTimeout(manualInitTimeout) // removes manual init button timeout
  let dayblocks = document.getElementsByClassName('dayblock');
  let openedBlock = document.getElementsByClassName('dayblock dopen');
  let daysAmount = 15;
  if (openedBlock.length === 0)
     return;
  let startDate = convertMudaksDate(openedBlock[0].getElementsByClassName('daydate')[0].textContent);
  let supername = document.getElementsByClassName('supername');
  let edugroup = document.getElementsByClassName('edugroup');
  let groupName = '';
  if (supername.length !== 0)
    groupName = supername[0].textContent;
  else if (edugroup.length !== 0)
    groupName = edugroup[0].textContent;
  else
    return;
  console.log(`Loading additional info from ${startDate} by group ${groupName} for ${daysAmount} days ahead`)
  fetch(`http://fuckineeddomain.ru/MGUschedule/?group=${groupName}&start=${startDate}&amount=${daysAmount}`)
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < dayblocks.length; i++) {
        let dayDate = convertMudaksDate(dayblocks[i].getElementsByClassName('daydate')[0].textContent);
        if (dayDate in data['schedule']) {
            let lessons = dayblocks[i].getElementsByClassName('pairhead')
            for (let l = 0; l < lessons.length; l++){
              let lessonNum = lessons[l].getElementsByClassName('pairnum')[0]
              lessonNum = lessonNum.textContent
              if (lessonNum === '')
                continue
              if (lessonNum in data['schedule'][dayDate]){
                let groupsInfo = ''
                for (let g in data['schedule'][dayDate][lessonNum]){
                  groupsInfo += `${data['groupsInfo'][data['schedule'][dayDate][lessonNum][g]]}  `
                }
                let lessonKind = lessons[l].getElementsByClassName('subjkind')[0]
                lessonKind.innerHTML += `<br> ${groupsInfo}`
              }
            }
            dayblocks[i].getElementsByClassName('dayname')[0].textContent += '+';
        }
      }
    });
}

window.addEventListener("load", (event) => { // when page loaded - start .setup()
    setup();
});
