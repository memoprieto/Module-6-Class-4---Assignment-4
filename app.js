const nonImpIcon = "far fa-star";
const impIcon = "fas fa-star";
var isImportant = false;
var isVisible = true;

function toggleImportant() {
  if (isImportant) {
    $("#iImportant").removeClass(impIcon).addClass(nonImpIcon);
    isImportant = false;
  } else {
    $("#iImportant").removeClass(nonImpIcon).addClass(impIcon);
    isImportant = true;
  }
}

function togglePanel() {
  if (isVisible) {
    $("#pnlForm").fadeOut();
    isVisible = false;
  } else {
    $("#pnlForm").fadeIn();
    isVisible = true;
  }
}

function saveTask() {
  //console.log("Saving....");
  // read all values to vars
  let title = $("#txtTitle").val();
  let duration = $("#txtDuration").val();
  let deadline = $("#selDeadline").val();
  let theLocation = $("#txtLocation").val();
  let status = $("#selStatus").val();

  //console.log(title, duration, deadline, theLocation, status);

  let task = new Task(0, title, isImportant, duration, deadline, theLocation, status);
  console.log(task);
  console.log(JSON.stringify(task));

  $.ajax({
    url:"https://fsdiapi.azurewebsites.net/api/tasks/",
    type: "POST",
    data: JSON.stringify(task),
    contentType: "application/json",
    success: function (response) {
      //console.log("Server says:", response);
      let saveTask = JSON.parse(response); // parse json response into is object
      displayTask(task);
    },
    error: function (details) {
      console.log("Error saving", details);
    },
  }); 
}

function displayTask(task) {
    let syntax= `<div class='task'>
        <h3>${task.title}</h3>
        <label>${task.location}</label>
        <div class='dates'>
          <label>${task.duration}</label>
          <label>${task.deadline}</label>
        </div>
    </div>`;

    $("#task-list").append(syntax);
}

function testRequest() {
  $.ajax({
    url: "https://fsdiapi.azurewebsites.net/",
    type: "GET",
    success: function(response) {
      console.log(response);
    },
    error: function(errorDet) {
      console.log("Error on request", errorDet);
    },
  });
}

/**
 *  send get req to https://fsdiapi.azurewebsites.net/api/tasks
 *  response => json string
 *  parse the response => array
 *  console log the array
 * 
 */

function fetchTasks() {
  $.ajax({
    type:"GET",
    url: "https://fsdiapi.azurewebsites.net/api/tasks",
    success: function(response) {
      let tasks=JSON.parse(response); // array of tasks
      for (let i=0; i<tasks.length; i++) {
        let item=tasks[i];
        if (item.name == "Sergio") {
          displayTask(item);
        }
      }
      //console.log(tasks);
      // for loop, get every object and send it to displayTask()
      // before you display tasks, check if the tasks is yours
      // and only then display it      
    },
    error: function (dets) {
      console.log("Error fetching tasks", dets);
    },
  });
}

// DELETE all your tasks
// DELETE request to https://fsdiapi.azurewebsites.net/api/tasks/clear/Sergio

function clearAllTasks() {
  $.ajax({
    type: "DELETE",
    url: "https://fsdiapi.azurewebsites.net/api/tasks/clear/Sergio",
    success: function(){
      // clear the data from screen ??
      // jquery clear div content
      $("#task-list").html("");
    },
    error: function(err) {
       console.error(err);
    },
  });
}

function init() {
  // runTest();
  console.log("task manager");

  // load data
  fetchTasks();

  // hook events
  $("#iImportant").click(toggleImportant);
  $("#btnShowHide").click(togglePanel);
  $("#btnSave").click(saveTask);
  $("#btnClear").click(clearAllTasks);
}

window.onload = init;

