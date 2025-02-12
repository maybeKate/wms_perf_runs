/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 97.5, "KoPercent": 2.5};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.09027777777777778, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.05, 500, 1500, "List of Vehicles in the tab on the map (org.level filter + random pageSize and pageNumber)"], "isController": false}, {"data": [0.0, 500, 1500, "List of Vehicles (random searchText + random pageSize and pageNumber)"], "isController": false}, {"data": [0.0, 500, 1500, "FULL List of vehicles statuses for map"], "isController": false}, {"data": [0.0, 500, 1500, "List of vehicles statuses for map (random searchText)"], "isController": false}, {"data": [0.0, 500, 1500, "List of Vehicles in the tab on the map (random searchText + random pageSize and pageNumber)"], "isController": false}, {"data": [0.275, 500, 1500, "Login"], "isController": false}, {"data": [0.0, 500, 1500, "FULL List of Vehicles (random pageSize and pageNumber)"], "isController": false}, {"data": [0.0, 500, 1500, "List of Vehicles on the map (short) (random searchText)"], "isController": false}, {"data": [0.825, 500, 1500, "randomPageSize"], "isController": false}, {"data": [0.0, 500, 1500, "List of Vehicles on the map (short) (contractorType&contractorId filter)"], "isController": false}, {"data": [0.0, 500, 1500, "List of Vehicles (contractorType&contractorId filter+ random pageSize and pageNumber)"], "isController": false}, {"data": [0.025, 500, 1500, "List of Vehicles on the map (short) (org.level filter)"], "isController": false}, {"data": [0.0, 500, 1500, "List of vehicles statuses for map (contractorType&contractorId filter)"], "isController": false}, {"data": [0.0, 500, 1500, "FULL List of Vehicles in the tab on the map (random pageSize and pageNumber)"], "isController": false}, {"data": [0.325, 500, 1500, "List of vehicles statuses for map (org.level filter)"], "isController": false}, {"data": [0.0, 500, 1500, "List of Vehicles in the tab on the map (contractorType&contractorId filter+ random pageSize and pageNumber)"], "isController": false}, {"data": [0.0, 500, 1500, "FULL List of Vehicles on the map (short)"], "isController": false}, {"data": [0.125, 500, 1500, "List of Vehicles (org.level filter + random pageSize and pageNumber)"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 360, 9, 2.5, 13274.177777777775, 0, 60200, 10207.0, 33917.20000000003, 50138.0, 60158.56, 1.4408241514146092, 1762.905014480783, 2.0836176105232194], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["List of Vehicles in the tab on the map (org.level filter + random pageSize and pageNumber)", 20, 0, 0.0, 2281.4500000000003, 1084, 3338, 2225.5, 3154.2000000000007, 3330.15, 3338.0, 0.08703258064656504, 1.0438172666656513, 0.1544190860817497], "isController": false}, {"data": ["List of Vehicles (random searchText + random pageSize and pageNumber)", 20, 4, 20.0, 46561.950000000004, 21972, 60161, 44099.5, 60156.6, 60160.8, 60161.0, 0.08346688034188034, 0.7187566186627771, 0.15638221023429152], "isController": false}, {"data": ["FULL List of vehicles statuses for map", 20, 0, 0.0, 10260.649999999998, 4502, 14553, 11075.5, 13417.500000000002, 14500.3, 14553.0, 0.08289124668435013, 0.10000780343376989, 0.10280457352453581], "isController": false}, {"data": ["List of vehicles statuses for map (random searchText)", 20, 0, 0.0, 11818.649999999998, 4412, 17982, 11813.0, 16615.3, 17913.95, 17982.0, 0.08248000890784096, 0.09902433881962859, 0.10286239782788896], "isController": false}, {"data": ["List of Vehicles in the tab on the map (random searchText + random pageSize and pageNumber)", 20, 5, 25.0, 48233.35000000001, 26622, 60200, 49902.0, 60165.9, 60198.35, 60200.0, 0.08226356423344754, 0.6323288480838759, 0.13714075244425614], "isController": false}, {"data": ["Login", 20, 0, 0.0, 2618.6500000000005, 691, 5213, 989.0, 5146.200000000001, 5210.65, 5213.0, 3.8358266206367473, 8.948451584675873, 1.3972298139624089], "isController": false}, {"data": ["FULL List of Vehicles (random pageSize and pageNumber)", 20, 0, 0.0, 13758.800000000001, 5690, 18486, 14371.0, 16922.100000000002, 18408.8, 18486.0, 0.08157538381218084, 1.0977624891912616, 0.15238425090344737], "isController": false}, {"data": ["List of Vehicles on the map (short) (random searchText)", 20, 0, 0.0, 18191.700000000004, 7633, 25365, 18416.0, 24063.100000000002, 25301.649999999998, 25365.0, 0.08173306797330598, 15.838814982897354, 0.11922332385910853], "isController": false}, {"data": ["randomPageSize", 20, 0, 0.0, 340.9, 0, 1062, 318.5, 927.9, 1055.35, 1062.0, 4.559963520291838, 0.0, 0.0], "isController": false}, {"data": ["List of Vehicles on the map (short) (contractorType&contractorId filter)", 20, 0, 0.0, 10214.85, 4601, 15466, 10817.0, 14387.800000000003, 15417.949999999999, 15466.0, 0.08303958081619604, 397.0092394832966, 0.12616501936898222], "isController": false}, {"data": ["List of Vehicles (contractorType&contractorId filter+ random pageSize and pageNumber)", 20, 0, 0.0, 13734.5, 7518, 18426, 14813.5, 17354.500000000004, 18380.1, 18426.0, 0.09358782983860779, 1.264285670416419, 0.1801702815940815], "isController": false}, {"data": ["List of Vehicles on the map (short) (org.level filter)", 20, 0, 0.0, 2708.9, 1353, 4222, 2559.0, 3897.0000000000014, 4208.849999999999, 4222.0, 0.08752543708015142, 134.80589610320342, 0.13692944355703376], "isController": false}, {"data": ["List of vehicles statuses for map (contractorType&contractorId filter)", 20, 0, 0.0, 6985.0, 2373, 11111, 7497.0, 9908.6, 11052.25, 11111.0, 0.08320817437105021, 0.10038611193163617, 0.11302985405286216], "isController": false}, {"data": ["FULL List of Vehicles in the tab on the map (random pageSize and pageNumber)", 20, 0, 0.0, 19006.85, 9132, 23272, 20202.0, 22706.2, 23244.25, 23272.0, 0.08509262332048434, 1.0203677503744075, 0.14150388048953785], "isController": false}, {"data": ["List of vehicles statuses for map (org.level filter)", 20, 0, 0.0, 1411.3000000000002, 362, 2098, 1435.5, 2052.8, 2096.0, 2098.0, 0.08752965066916417, 0.10548434121902545, 0.11830179348254222], "isController": false}, {"data": ["List of Vehicles in the tab on the map (contractorType&contractorId filter+ random pageSize and pageNumber)", 20, 0, 0.0, 12344.849999999999, 4446, 21362, 11827.0, 20333.200000000004, 21319.3, 21362.0, 0.08166365191685007, 1.0022259406121508, 0.14068637533839376], "isController": false}, {"data": ["FULL List of Vehicles on the map (short)", 20, 0, 0.0, 16538.8, 6416, 26027, 16929.5, 23593.60000000001, 25925.649999999998, 26027.0, 0.08659995583402252, 1334.3831745622372, 0.12584056082131398], "isController": false}, {"data": ["List of Vehicles (org.level filter + random pageSize and pageNumber)", 20, 0, 0.0, 1924.05, 647, 3437, 1912.0, 3018.3000000000006, 3417.5499999999997, 3437.0, 0.08402231632721652, 1.1345925587210963, 0.16630921078888553], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 9, 100.0, 2.5], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 360, 9, "504/Gateway Time-out", 9, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["List of Vehicles (random searchText + random pageSize and pageNumber)", 20, 4, "504/Gateway Time-out", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["List of Vehicles in the tab on the map (random searchText + random pageSize and pageNumber)", 20, 5, "504/Gateway Time-out", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
