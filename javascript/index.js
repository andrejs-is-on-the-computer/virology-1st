
function get_date (date) {
  document.getElementById(date).innerHTML = new Date().toDateString();
};

function test_js () {
  console.log('yes');
};

function render_dom(content, destination_element){
  (function () {
        document.getElementById(destination_element).innerHTML = content;
        })();
  try{
  } catch (e) {
    console.error('Render content error');
  }
}

function upload_text (target, display) {
  document.querySelector("#"+target).addEventListener('change', function() {
  	// files that user has chosen
  	var all_files = this.files;
  	if(all_files.length == 0) {
  		alert('Error : No file selected');
  		return;
  	}

  	// first file selected by user
  	var file = all_files[0];
  	// files types allowed
  	var allowed_types = [ 'text/plain' ];
  	if(allowed_types.indexOf(file.type) == -1) {
  		alert('Error : Incorrect file type');
  		return;
  	}

  	// Max 2 MB allowed
  	var max_size_allowed = 2*1024*1024
  	if(file.size > max_size_allowed) {
  		alert('Error : Exceeded size 2MB');
  		return;
  	}

  	// file validation is successfull
  	// we will now read the file

  	var reader = new FileReader();

  	// file reading started
  	// reader.addEventListener('loadstart', function() {
  	//     document.querySelector("#file-input-label").style.display = 'none';
  	// });

  	// file reading finished successfully
  	reader.addEventListener('load', function(e) {
  	    var text = e.target.result;
        console.log(JSON.parse(text));
  	    // contents of the file
  	    document.querySelector("#"+display).innerHTML = text;
  	    document.querySelector("#"+display).style.display = 'block';

  	    document.querySelector("#file-input-label").style.display = 'block';
  	});

  	// file reading failed
  	reader.addEventListener('error', function() {
  	    alert('Error : Failed to read file');
  	});

  	// file read progress
  	reader.addEventListener('progress', function(e) {
  	    if(e.lengthComputable == true) {
  	    	document.querySelector("#file-progress-percent").innerHTML = Math.floor((e.loaded/e.total)*100);
  	    	document.querySelector("#file-progress-percent").style.display = 'block';
  	    }
  	});

  	// read as text file
  	reader.readAsText(file);
  });
};

// GET TABLE INTO JSON FILE ///////////////////////////////////
// var table = document.getElementById("table_data");

function table_to_json(table_data) {
  var headers = [];
  var data = []; // first row needs to be headers var headers = [];
  for (var i=0; i<table_data.rows[0].cells.length; i++) {
      headers[i] = table_data.rows[0].cells[i].innerHTML.toLowerCase().replace(/\W/g, '');
    }
// go through cells
  for (var i=1; i<table_data.rows.length; i++) {
    var tableRow = table_data.rows[i];
    var rowData = {};
    for (var j=0; j<tableRow.cells.length; j++) {
      rowData[ headers[j] ] = tableRow.cells[j].innerHTML;
    }
    data.push(rowData);
  }

  return data;
}
////////////////////////////////////////////////////////////////

function add_symptom_obj(passed_id) {
  var that = this;
  this.symptoms.forEach(function (symptom_key) {
    if (symptom_key.id == passed_id){
      that.display_symptoms.push(symptom_key);
      return;
    }
  });
};

function remove_symptom_obj (index) {
  var that = this;
  if (index > -1) {
    that.display_symptoms.splice(index, 1);
  }
};

function remove_selected(id) {
  var that = this;
  var index = '';
  display_symptoms.forEach(function (selected_symptom){
    if (selected_symptom.id === id) {
      index = that.display_symptoms.indexOf(selected_symptom);
    }
  });

  if (index > -1) {
    that.display_symptoms.splice(index, 1);
  }
  update_selected_table();
  create_symptoms_table(symptoms);
};


function add_symptom(clicked_id) {
    var that = this;
    var found = false;
    var index = '';
    var symptom_key_to_push = '';
    if (display_symptoms.length > 0){
      display_symptoms.forEach(function (selected_symptom){
        if (selected_symptom.id === clicked_id) {
          index = that.display_symptoms.indexOf(selected_symptom);
          found = true;
        }
      });
      if (!found) {
        that.add_symptom_obj(clicked_id);
      } else {
        if (index > -1) {
          that.remove_symptom_obj(index);
        }
      }
    } else {
      that.add_symptom_obj(clicked_id);
    }
    // create_symptoms_table(symptoms);
    //
    update_selected_table();
};

function update_selected_table () {
  var table_content = ``;
  if (typeof display_symptoms === 'undefined'){
    var empty = [];
    create_selected_table(empty);
  }
  else if (display_symptoms.length > 0){
    create_selected_table(display_symptoms);
  } else {
    var empty = [];
    create_selected_table(empty);
  }
  // $('#symptoms').DataTable({
  //   paging: false,
  //   info: false
  // }).ajax.draw();
  // $('#symptoms_selected').DataTable().ajax.draw();
};

var display = 'none';
var symbol = 'fa fa-caret-square-o-up';

function hide_show() {
  var that = this;
  var x = document.getElementById("symptoms_selected");
  var symbol_class = document.getElementById("symbol");
  if (x.style.display === "none") {
    x.style.display = "table";
    that.display = "table";
    symbol_class.classList.remove("fa-caret-square-o-up");
    symbol_class.classList.add("fa-caret-square-o-down");
  } else {
    x.style.display = "none";
    that.display = "none";
    symbol_class.classList.add("fa-caret-square-o-up");
    symbol_class.classList.remove("fa-caret-square-o-down");
  }
};

function create_selected_table (symptoms) {
  var that = this;
  // fa fa-caret-square-o-down
  // fa fa-caret-square-o-up
  var table_content = `
    <span id="selected_title" onClick="hide_show()">
      ${symptoms.length} symptom's added &nbsp; <span id="symbol" class="fa fa-caret-square-o-up"></span>
    </span>
    <br>
    <table class="sortable" id="symptoms_selected" style="display: ${that.display}; width: 100%;">
    <thead>
      <tr class="sortable">
        <th>
          Symptom
        </th>
        <th>
          Stealth
        </th>
        <th>
          Resistance
        </th>
        <th>
          Stage speed
        </th>
        <th>
          Transmission
        </th>
        <th>
          Level
        </th>
        <th>
          Required Chemical
        </th>
        <th>
          Effect
        </th>
        <th>
          Threshold
        </th>
      </tr>
    </thead>`;
    if (symptoms.length < 1){
      table_content += `
      <tr>
        <td>
          No symptoms selected
        </td>
        <td>

        </td>
        <td>

        </td>
        <td>

        </td>
        <td>

        </td>
        <td>

        </td>
        <td>

        </td>
        <td>

        </td>
        <td>

        </td>
      </tr>`;
    }
    else {
      var stealth = 0;
      var resist = 0;
      var speed = 0;
      var trans = 0;
      var level = 0;
  symptoms.forEach(function (symptom) {
      stealth += symptom.stealth;
      resist += symptom.resistance;
      speed += symptom.stage_speed;
      trans += symptom.transmission;
      level += symptom.level;
      table_content += `
      <tr id="${symptom.id}" onClick="remove_selected(${symptom.id})">
        <td>
          ${symptom.symptom}
        </td>
        <td>
          ${symptom.stealth}
        </td>
        <td>
          ${symptom.resistance}
        </td>
        <td>
          ${symptom.stage_speed}
        </td>
        <td>
          ${symptom.transmission}
        </td>
        <td>
          ${symptom.level}
        </td>
        <td>
          ${symptom.required_chemical}
        </td>
        <td>
          ${symptom.effect}
        </td>
        <td>
          ${symptom.threshold}
        </td>
      </tr>
      `;

    });
    table_content += `<tr>
      <td style="background-color: #48466d;">
        Total
      </td>
      <td>
        ${stealth}
      </td>
      <td>
        ${resist}
      </td>
      <td>
        ${speed}
      </td>
      <td>
        ${trans}
      </td>
      <td>
        ${level}
      </td>
      <td>
        ---
      </td>
      <td>
        ---
      </td>
      <td>
        ---
      </td>
    </tr>`;
  }

  table_content += `</table>`;
  document.getElementById("selected_table").innerHTML = table_content;
}

function create_symptoms_table (symptoms) {
  var that = this;
  var table_content = `
    <table class="sortable" id="symptoms" style="width: 100%;">
    <thead>
      <tr class="sortable">
        <th>
          Symptom
        </th>
        <th>
          Stealth
        </th>
        <th>
          Resistance
        </th>
        <th>
          Stage speed
        </th>
        <th>
          Transmission
        </th>
        <th>
          Level
        </th>
        <th>
          Required Chemical
        </th>
        <th>
          Effect
        </th>
        <th>
          <span title="Hover mouse over each threshold for more information">Threshold <i class="fa fa-question-circle"></i></span>
        </th>
      </tr>
    </thead>`;
  symptoms.forEach(function (symptom) {
      var is_selected = 'unselected';
      display_symptoms.forEach(function (selected_symptom){
        if (selected_symptom.id === symptom.id) {
          index = that.display_symptoms.indexOf(selected_symptom);
          is_selected = 'selected';
        }
      });
      table_content += `
      <tr id="${symptom.id}" class="${is_selected}" onClick="add_symptom(${symptom.id})">
        <td>
          ${symptom.symptom}
        </td>
        <td>
          ${symptom.stealth}
        </td>
        <td>
          ${symptom.resistance}
        </td>
        <td>
          ${symptom.stage_speed}
        </td>
        <td>
          ${symptom.transmission}
        </td>
        <td>
          ${symptom.level}
        </td>
        <td>
          ${symptom.required_chemical}
        </td>
        <td>
          ${symptom.effect}
        </td>
        <td>
          ${symptom.threshold}
        </td>
      </tr>
      `;
  });
  table_content += `</table>`;
  document.getElementById("table_section").innerHTML = table_content;
};

function empty_selected_content() {
  var table_content = `
    <table class="sortable" style="width: 100%;">
    <thead>
      <tr class="sortable">
        <th>
          Symptom
        </th>
        <th>
          Stealth
        </th>
        <th>
          Resistance
        </th>
        <th>
          Stage speed
        </th>
        <th>
          Transmission
        </th>
        <th>
          Level
        </th>
        <th>
          Required Chemical
        </th>
        <th>
          Effect
        </th>
        <th>
          <span title="Hover mouse over each threshold for more information">Threshold <i class="fa fa-question-circle"></i></span>
        </th>
      </tr>
    </thead>
      <tr>
        <td>
          No symptoms selected
        </td>
        <td>

        </td>
        <td>

        </td>
        <td>

        </td>
        <td>

        </td>
        <td>

        </td>
        <td>

        </td>
        <td>

        </td>
        <td>

        </td>
      </tr>
      `;
  table_content += `</table>`;
  document.getElementById("selected_table").innerHTML = table_content;
};

// File reader that doesn't work because browsers are gay
// function readTextFile(file)
// {
//     var rawFile = new XMLHttpRequest();
//     rawFile.open("GET", file, false);
//     rawFile.onreadystatechange = function ()
//     {
//         if(rawFile.readyState === 4)
//         {
//             if(rawFile.status === 200 || rawFile.status == 0)
//             {
//                 var allText = rawFile.responseText;
//                 alert(allText);
//             }
//         }
//     }
//     rawFile.send(null);
// }



// EXPORT JSON TO TEXT FILE ////////////////////////////////
// var json = tableToJson(table);
//
// var data  = "text/json;charset=utf-8," + encodeURIComponent(json);
//
// var a       = document.createElement('a');
// a.href      = 'data:' + data;
// a.download  = 'data.txt';
// a.innerHTML = 'download .txt file of json';
//
// document.getElementById('container').appendChild(a);
///////////////////////////////////////////////////////////
