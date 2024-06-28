function displayDateTime() {
      var date = new Date();
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();
      var formattedTime = formatTime(hours) + ":" + formatTime(minutes) + ":" + formatTime(seconds);
      var formattedDate = date.toDateString();

    setTimeout(function() {
      var marquee = document.getElementById('personal');
      marquee.innerHTML = "The time is: " + formattedTime;

      setTimeout(function() {
        marquee.innerHTML = "Next to do on the to-do list";
      }, 7000);
    }, 10000);
  }

function formatTime(time) {
  return (time < 10) ? "0" + time : time;
    }

    displayDateTime();
    setInterval(displayDateTime, 1000);

    var hideTimeout = 0.5 * 60 * 1000;
    var showTimeout = 1 * 60 * 1000;

    var fixedDiv = document.querySelector('.notice');

    function hideFixedDiv() {
      fixedDiv.style.display = 'none';
      setTimeout(showFixedDiv, showTimeout);
    }

    function showFixedDiv() {
      fixedDiv.style.display = 'block';
      setTimeout(hideFixedDiv, hideTimeout);
    }

    setTimeout(hideFixedDiv, hideTimeout);

  function calculateCGPA() {
    var totalGradePoints = 0;
    var totalCreditUnits = 0;

    // Loop through rows in the assessment table
    var rows = document.getElementById('assessmentTable').rows;
    for (var i = 1; i < rows.length; i++) { 
      var courseUnit = parseFloat(rows[i].cells[2].textContent);
      var acquired = parseFloat(rows[i].cells[3].textContent);

      var gradePoints = courseUnit * acquired;

      totalGradePoints += gradePoints;
      totalCreditUnits += courseUnit;
    }

    var cgpa = totalGradePoints / totalCreditUnits;

    document.getElementById('cgpaDisplay').textContent = "CGPA: " + cgpa.toFixed(2);
  }

let categorizedCourses = {
  "100 level": { "Harmattan": [], "Rain": [] },
  "200 level": { "Harmattan": [], "Rain": [] },
  "300 level": { "Harmattan": [], "Rain": [] },
  "400 level": { "Harmattan": [], "Rain": [] },
  "Unknown level": []
};

let semesterAverages = {
  "100 level": { "Harmattan": null, "Rain": null },
  "200 level": { "Harmattan": null, "Rain": null },
  "300 level": { "Harmattan": null, "Rain": null },
  "400 level": { "Harmattan": null, "Rain": null },
  "Unknown level": null
};

let subDisciplineAverages = {
  "100 level": { 
    "Harmattan": {'Micro': null, 'Macro': null, 'Accessories': null},
    "Rain": {'Micro': null, 'Macro': null, 'Accessories': null}
  },
  "200 level": { 
    "Harmattan": {'Micro': null, 'Macro': null, 'Accessories': null}, 
    "Rain": {'Micro': null, 'Macro': null, 'Accessories': null}
   },
  "300 level": { 
    "Harmattan": {'Micro': null, 'Macro': null, 'Accessories': null}, 
    "Rain": {'Micro': null, 'Macro': null, 'Accessories': null} 
  },
  "400 level": { 
    "Harmattan": {'Micro': null, 'Macro': null, 'Accessories': null}, 
    "Rain": {'Micro': null, 'Macro': null, 'Accessories': null} 
  },
  "Unknown level": {}
};


function addCourse(event) {
  event.preventDefault();

  let courseBranch = document.getElementById('subDiscipline').value;
  var form = event.target;
  let courseCode = form.elements[1].value;
  let courseUnit = Number(form.elements[2].value);
  let acquired = Number(form.elements[3].value);

  // Determine semester and level
  const semester = getSemester(courseCode);
  const level = getLevel(courseCode);

  categorizedCourses[level][semester].push([courseCode, courseBranch, semester, level, courseUnit, acquired]);

  const levelCourses = categorizedCourses[level];
  const semesterAverage = calculateSemesterAverage(levelCourses[semester]);

  semesterAverages[level][semester] = semesterAverage;

  console.log(categorizedCourses);
  console.log("Semester Averages:", semesterAverages);

  var assessTable = document.getElementById('assessmentTable');
  var newRow = assessTable.insertRow(-1);

  var cBranch = newRow.insertCell(0);
  var cItself = newRow.insertCell(1);
  var cUnit = newRow.insertCell(2);
  var cAcquired = newRow.insertCell(3);
  var actionsCell = newRow.insertCell(4);

  cBranch.textContent = courseBranch;
  cItself.textContent = courseCode;
  cUnit.textContent = courseUnit;
  cAcquired.textContent = acquired;

  newRow.classList.add(courseBranch);

  var removeButton = document.createElement('button');
  removeButton.textContent = 'X';
  removeButton.addEventListener('click', function () {
    var row = this.closest('tr');
    row.remove();
    calculateCGPA();
  });

  actionsCell.appendChild(removeButton);

  form.reset();
  calculateCGPA();
  calculateSubDisciplineAverages();
}

function calculateSubDisciplineAverages() {
  for (const level in categorizedCourses) {
    const levelCourses = categorizedCourses[level];
    const semesterAverages = subDisciplineAverages[level];

    for (const semester in levelCourses) {
      const semesterCourses = levelCourses[semester];
      const semesterAveragesObject = semesterAverages[semester];

      const subDisciplineTotals = {};
      const subDisciplineCounts = {};

      for (const course of semesterCourses) {
        const subDiscipline = course[1];
        const acquired = course[5];

        subDisciplineTotals[subDiscipline] = (subDisciplineTotals[subDiscipline] || 0) + acquired;
        subDisciplineCounts[subDiscipline] = (subDisciplineCounts[subDiscipline] || 0) + 1;
      }

      for (const subDiscipline in subDisciplineTotals) {
        const subDisciplineAverage = subDisciplineTotals[subDiscipline] / subDisciplineCounts[subDiscipline];
        semesterAveragesObject[subDiscipline] = subDisciplineAverage.toFixed(2);
      }
    }
  }

  console.log("Sub-discipline Averages:", subDisciplineAverages);
}

function calculateSemesterAverage(semesterCourses) {
  const totalCourses = semesterCourses.length;
  if (totalCourses === 0) {
    return 0;
  }
  const totalAcquired = semesterCourses.reduce((total, course) => total + course[5], 0);
  const semesterAverage = totalAcquired / totalCourses;
  return semesterAverage.toFixed(2);
}

function getSemester(courseCode) {
  const lastDigit = parseInt(courseCode.slice(-1));
  return lastDigit % 2 === 0 ? 'Rain' : 'Harmattan';
}

const repetitionCountMap = {};

function getLevel(courseCode) {
  const firstInteger = parseInt(courseCode.match(/\d+/));

  if (!isNaN(firstInteger)) {
    const sanitizedCourseCode = courseCode.replace(/\s+/g, '_');

    const repetitionCount = repetitionCountMap[sanitizedCourseCode] || 0;

    const adjustedLevel = firstInteger + (repetitionCount * 100);

    repetitionCountMap[sanitizedCourseCode] = repetitionCount + 1;

    if (adjustedLevel >= 100 && adjustedLevel < 200) {
      return '100 level';
    } else if (adjustedLevel >= 200 && adjustedLevel < 300) {
      return '200 level';
    } else if (adjustedLevel >= 300 && adjustedLevel < 400) {
      return '300 level';
    } else if (adjustedLevel >= 400 && adjustedLevel < 500) {
      return '400 level';
    } else {
      return 'Unknown level';
    }
  } else {
    return 'Invalid courseCode format';
  }
}
  document.addEventListener("DOMContentLoaded", function () {
    const data = [{
        x: ['100H', '100R', '200H', '200R', '300H', '300R', '400H', '400R'],
        y: [2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5], // Placeholder values for the "average" dataset
        name: 'Average',
        type: 'line',
        marker: {
            color: 'rgba(1, 1, 1, 0.2)',
            borderColor: 'rgba(1, 1, 1, 0.2)',
            borderWidth: 0.5
        }
    }];

    const layout = {
        xaxis: {
            title: 'Semester'
        },
        yaxis: {
            title: 'Grade Point',
            range: [0, 5]
        }
    };

    Plotly.newPlot('plotlyChart', data, layout);

    function updateChart(newData) {
        Plotly.react('plotlyChart', newData, layout);
    }

    function handleUserInput() {
        const microeconomicsData = [2, 4, 3.7, 4.2, 4.5, 3.8, 4.1, 4.3]; // Example data for microeconomics
        const macroeconomicsData = [3.8, 3.9, 3.6, 3.7, 4, 4.1, 3.9, 3.8]; // Example data for macroeconomics
        const accessoriesData = [4, 4.1, 3.9, 4.2, 4.3, 4.4, 4.2, 4.1]; // Example data for accessories

        const newData = [
            ...data, // Include the "average" dataset
            {
                x: ['100H', '100R', '200H', '200R', '300H', '300R', '400H', '400R'],
                y: microeconomicsData, 
                name: 'Microeconomics',
                type: 'line',
                marker: {
                    color: 'rgba(0, 143, 201, 0.7)',
                    borderColor: 'rgba(0, 143, 201, 0.7)',
                    borderWidth: 0.6
                }
            },
            {
                x: ['100H', '100R', '200H', '200R', '300H', '300R', '400H', '400R'],
                y: macroeconomicsData,
                name: 'Macroeconomics',
                type: 'line',
                marker: {
                    color: 'rgba(35, 64, 92, 1)',
                    borderColor: 'rgba(0, 111, 85, 0.7)',
                    borderWidth: 0.7
                }
            },
            {
                x: ['100H', '100R', '200H', '200R', '300H', '300R', '400H', '400R'],
                y: accessoriesData,
                name: 'Accessories',
                type: 'line',
                marker: {
                    color: 'rgba(165, 57, 171, 0.6)',
                    borderColor: 'rgba(165, 57, 171, 0.6)',
                    borderWidth: 0.6
                }
            },
            {
                x: ['100H', '100R', '200H', '200R', '300H', '300R', '400H', '400R'],
                y: getGPAData(), 
                name: 'GPA',
                type: 'line',
                marker: {
                    color: 'rgba(15, 57, 171, 0.6)',
                    borderColor: 'black',
                    borderWidth: 1
                }
            }
        ];

  const gpaData = getGPAData();
  newData[newData.length - 1].y = gpaData;
  updateChart(newData);
    }

    function getGPAData() {
        this.semesterAverages = semesterAverages

        const gpaData = [];

        for (const level in semesterAverages) {
            for (const semester in semesterAverages[level]) {
                gpaData.push(semesterAverages[level][semester] !== null ? semesterAverages[level][semester] : 5);
            }
        }
        return gpaData;
    }

    handleUserInput();
});