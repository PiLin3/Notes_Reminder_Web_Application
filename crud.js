const addBtn = document.querySelector('.add');
const closeBtn = document.querySelector('.close');
const AddNewItemPanel = document.querySelector('.new-note-temp');


const submit = document.querySelector('form');
const submitBtn = document.querySelector('#submit');
const saveBtn = document.querySelector('#save');
const tableBody = document.querySelector('tbody');
//table data names list
const inputNamesList = ['title', 'note', 'date', 'priority'];
let itemIndex = 0;

let notesArray;
if (localStorage.getItem('notes')) {
  notesArray = JSON.parse(localStorage.getItem('notes'));
  populateNoteList();
}else {
  notesArray = [];
}
function populateNoteList() {
  notesArray.forEach(function(note) {
    creatNewNote(note);
  });
}
//open and close new note panel 
addBtn.addEventListener('click', function(e){
  e.preventDefault();
  AddNewItemPanel.classList.add('visible');
  submitBtn.classList.add('visible');
});
closeBtn.addEventListener('click', function(e){
  e.preventDefault();
  AddNewItemPanel.classList.remove('visible');
  submitBtn.classList.remove('visible');
  saveBtn.classList.remove('visible');
});


//delete note
tableBody.addEventListener('click', function(e) {
  if (e.target.classList.contains('delete')) {
    let num = Number(e.target.parentNode.parentNode.getAttribute('data-index-number'));
    notesArray.splice(num, 1);
    e.target.parentNode.parentNode.remove();
    updateClassIndex();
  };
});
function updateClassIndex() {
  let rowData = tableBody.getElementsByTagName('tr')
  for (let i = 0; i < rowData.length; i++) {
    rowData[i].setAttribute('data-index-number', i);
  }
  itemIndex--;
  localStorage.setItem('notes', JSON.stringify(notesArray));
}


//edit note
let editData;
let iNum;
tableBody.addEventListener('click', function(e) {
  if (e.target.classList.contains('edit')) {
    AddNewItemPanel.classList.add('visible');
    saveBtn.classList.add('visible');
    editData = e.target.parentNode.parentNode.getElementsByTagName('td');
    iNum = Number(e.target.parentNode.parentNode.getAttribute('data-index-number'));
    for (let i = 1; i < 5; i++) {
      document.querySelector('#' + inputNamesList[i - 1]).value = editData[i].innerText;
    }
  };
});
saveBtn.addEventListener('click', function() {
  editNote(editData, iNum);
  localStorage.setItem('notes', JSON.stringify(notesArray));
});
//add new notes
submit.addEventListener('submit', function(e) {
  e.preventDefault();
  creatNewNote(getInput());
});
function creatNewNote(noteData) {
  //creat new row for note data
  const newRow = document.createElement('tr');
  newRow.classList.add('note-template');
  newRow.setAttribute('data-index-number', itemIndex);
  tableBody.appendChild(newRow);
  itemIndex++;
  //creat edit and delete buttons
  const editBtn = document.createElement('button');
  editBtn.classList.add('edit', 'note-btn');
  const delBtn = document.createElement('button');
  delBtn.classList.add('delete', 'note-btn');
  //creat the table data
  const tdList = []
  for (let i = 0; i < 6; i++) {
    tdList[i] = document.createElement('td');
  }
  tdList[0].classList.add('item-align');
  tdList[5].classList.add('item-align');
  tdList[0].appendChild(editBtn);
  tdList[5].appendChild(delBtn);
  tdList[4].classList.add('priority', 'item-align');
  //append the input data
  for (let i = 0; i < 6; i++) {
    newRow.appendChild(tdList[i]);
    if (i > 0 && i < 5) {
      tdList[i].textContent = noteData[inputNamesList[i - 1]];
    }
  }
  checkPriority(tdList[4]);
  localStorage.setItem('notes', JSON.stringify(notesArray));
  AddNewItemPanel.classList.remove('visible');
  submitBtn.classList.remove('visible');
  saveBtn.classList.remove('visible');
  }
  //fetch and assign the input data
  function getInput() {
    let newNote = {};
    for (let i = 0; i < 4; i++) {
      newNote[inputNamesList[i]] = document.querySelector('#' + inputNamesList[i]).value;
      document.querySelector('#' + inputNamesList[i]).value = '';
    }
    notesArray.push(newNote);
    return newNote;
  }

  function editNote(data, index) {
    for (let i = 0; i < 4; i++) {
      data[i + 1].innerText = document.querySelector('#' + inputNamesList[i]).value;
      notesArray[index][inputNamesList[i]] = document.querySelector('#' + inputNamesList[i]).value;
      document.querySelector('#' + inputNamesList[i]).value = '';
    }
    checkPriority(data[4]);
    AddNewItemPanel.classList.remove('visible');
    submitBtn.classList.remove('visible');
    saveBtn.classList.remove('visible');
  }
  function checkPriority(notePriority) {
    if (notePriority.innerText === 'high') {
      notePriority.classList.remove('avg');
      notePriority.classList.remove('low');
      notePriority.classList.add('high');
    } else if (notePriority.innerText === 'avg') {
      notePriority.classList.remove('high');
      notePriority.classList.remove('low');
      notePriority.classList.add('avg');
    } else {
      notePriority.classList.remove('high');
      notePriority.classList.remove('avg');
      notePriority.classList.add('low');
    };
  }