let simulator = null;

window.onload = function(){
    $("#buttonReset").prop("disabled", true);
    $("#buttonStop").prop("disabled", true);
    $("#buttonEndEmergency").prop("disabled", true);
}

function startSimulation(){

    let parameterObj = {
        confirmedToday:             Number($("#inputConfirmedToday").val()),
        confirmed1WeekAgo:          Number($("#inputConfirmed1WeekAgo").val()),
        confirmed2WeekAgo:          Number($("#inputConfirmed2WeekAgo").val()),
        confirmedTotal:             Number($("#inputConfirmedTotal").val()),
        vaccinatedTotal:            Number($("#inputVaccinatedTotal").val()),
        
        population:                 Number($("#inputPopulation").val()),
        normalReproduceRate:              Number($("#inputReproduceRate").val()),
        emergencyReproduceRate:              Number($("#inputEmergencyReproduceRate").val()),
        incubationPeriod:           Number($("#inputIncubationPeriod").val()),
        spreadDays:                 Number($("#inputSpreadDays").val()),
        confirmDelay:               Number($("#inputConfirmDelay").val()),
        confirmPercent:             Number($("#inputConfirmPercent").val()),
        vaccineDosePerDay:          Number($("#inputVaccineDosePerDay").val()),
        vaccineEffectivenessPercent:Number($("#inputVaccineEffectivenessPercent").val()),
        vaccineWantPercent:         Number($("#inputVaccineWantPercent").val()),
    }

    $("#buttonReset").prop("disabled", false);
    $("#buttonEmergency").prop("disabled", false);
    $("#buttonEndEmergency").prop("disabled", true);

    //$("#buttonProceed").prop("disabled", false);
    //$("#buttonAuto").prop("disabled", false);
    //$("#buttonStop").prop("disabled", );
    
    simulator = new CovMain(parameterObj);
    $("#labelConfirmedToday").html("" + simulator.todayConfirmed);
    drawChart();
}

function processDay(){
    if(simulator == null){
        startSimulation();
        return;
    }

    simulator.processDay();
    $("#labelConfirmedToday").html("" + simulator.todayConfirmed);
    drawChart();
}

let stopAutoFlag = false;

function auto(){
    stopAutoFlag = false;
    $("#buttonStop").prop("disabled", false);
    if(simulator == null){
        startSimulation();
    }

    let f = ()=>{
        if(stopAutoFlag) {  //stopAutoFlagがtrueならsetTimeoutせずに停止
            stopAutoFlag = false;
            $("#buttonStop").prop("disabled", true);
            return;
        }
        if(simulator.todayConfirmed < 10) {
            //$("#labelConfirmedToday").html("0");
            $("#buttonStop").prop("disabled", true);
            return;
        }
        simulator.processDay();
        $("#labelConfirmedToday").html("" + simulator.todayConfirmed);
        drawChart();
        setTimeout(f, 200);
    }
    f();
}

function stopAuto(){
    stopAutoFlag = true;
}

function emergency(){
    simulator.emergency();
    $("#buttonEndEmergency").prop("disabled", false);
    $("#buttonEmergency").prop("disabled", true);
}

function endEmergency(){
    simulator.endEmergency();
    $("#buttonEmergency").prop("disabled", false);
    $("#buttonEndEmergency").prop("disabled", true);
}

let myChart = null;
let totalChart = null;

// グラフ描画処理
function drawChart() {
    let ctx = document.getElementById('canvasChart').getContext('2d');
    let dataObj = generateChartDataset();
    if(myChart != null) myChart.destroy();
    myChart = new Chart(ctx, { // インスタンスをグローバル変数で生成
        type: 'line',
        data: { // ラベルとデータセット
            labels: dataObj.labels,
            datasets: [{
                data: dataObj.data, // グラフデータ
                backgroundColor: 'rgb(0, 134, 197, 0.7)', // 棒の塗りつぶし色
                borderColor: 'rgba(0, 134, 197, 1)', // 棒の枠線の色
                borderWidth: 1, // 枠線の太さ
            }],
        },
        options: {
            animation: false,

            legend: {
            display: false, // 凡例を非表示
            },

            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        min: 0
                    }
                }]
            }
        }
    });

    ctx = document.getElementById('canvasTotalChart').getContext('2d');
    dataObj = generateTotalChartDataset();
    if(totalChart != null) totalChart.destroy();
    totalChart = new Chart(ctx, { // インスタンスをグローバル変数で生成
        type: 'line',
        data: { // ラベルとデータセット
            labels: dataObj.labels,
            datasets: dataObj.datasets,
        },
        options: {
            animation: false,

            legend: {
            display: false, // 凡例を非表示
            },

            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        min: 0
                    }
                }]
            }
        }
    });
}

function generateChartDataset() {
    let data = simulator.getConfirmedHistory();
    let dataset = {
        data: data,
        labels: range(1, data.length),
    }
    return dataset;
}

function generateTotalChartDataset() {
    let datasets = [];
    let data;

    if($("#checkboxTotalConfirmed").is(":checked")){
        data = {
            data: simulator.getConfirmedTotalHistory(),
            backgroundColor: 'rgb(0, 134, 197, 0.7)', // 棒の塗りつぶし色
            borderColor: 'rgba(0, 134, 197, 1)', // 棒の枠線の色
            borderWidth: 1, // 枠線の太さ
        }
        datasets.push(data);
    }

    if($("#checkboxTotalInfected").is(":checked")){
        data = {
            data: simulator.getInfectedTotalHistory(),
            backgroundColor: 'rgb(127, 134, 20, 0.7)', // 棒の塗りつぶし色
            borderColor: 'rgba(127, 134, 20, 1)', // 棒の枠線の色
            borderWidth: 1, // 枠線の太さ
        }
        datasets.push(data);
    }

    if($("#checkboxTotalVaccinated").is(":checked")){
        data = {
            data: simulator.getVaccinatedTotalHistory(),
            backgroundColor: 'rgb(167, 0, 134, 0.7)', // 棒の塗りつぶし色
            borderColor: 'rgba(167, 0, 134, 1)', // 棒の枠線の色
            borderWidth: 1, // 枠線の太さ
        }
        datasets.push(data);
    }

    if($("#checkboxTotalImmune").is(":checked")){
        data = {
            data: simulator.getImmuneTotalHistory(),
            backgroundColor: 'rgb(117, 100, 134, 0.7)', // 棒の塗りつぶし色
            borderColor: 'rgba(117, 100, 134, 1)', // 棒の枠線の色
            borderWidth: 1, // 枠線の太さ
        }
        datasets.push(data);
    }

    let dataobj = {
        datasets: datasets,
        labels: range(1, (datasets.length > 0) ? datasets[0].data.length : null),
    }
    return dataobj;
}

//start<=x<=end
function range(start, end){
    let result = [];
    for(let i=start; i<=end; i++) result.push(i);
    return result;
}