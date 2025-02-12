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

    var data = {"OkPercent": 96.94444444444444, "KoPercent": 3.0555555555555554};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.11388888888888889, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.125, 500, 1500, "List of Vehicles in the tab on the map (org.level filter + random pageSize and pageNumber)"], "isController": false}, {"data": [0.0, 500, 1500, "List of Vehicles (random searchText + random pageSize and pageNumber)"], "isController": false}, {"data": [0.0, 500, 1500, "FULL List of vehicles statuses for map"], "isController": false}, {"data": [0.0, 500, 1500, "List of vehicles statuses for map (random searchText)"], "isController": false}, {"data": [0.0, 500, 1500, "List of Vehicles in the tab on the map (random searchText + random pageSize and pageNumber)"], "isController": false}, {"data": [0.4, 500, 1500, "Login"], "isController": false}, {"data": [0.0, 500, 1500, "FULL List of Vehicles (random pageSize and pageNumber)"], "isController": false}, {"data": [0.0, 500, 1500, "List of Vehicles on the map (short) (random searchText)"], "isController": false}, {"data": [1.0, 500, 1500, "randomPageSize"], "isController": false}, {"data": [0.0, 500, 1500, "List of Vehicles on the map (short) (contractorType&contractorId filter)"], "isController": false}, {"data": [0.0, 500, 1500, "List of Vehicles (contractorType&contractorId filter+ random pageSize and pageNumber)"], "isController": false}, {"data": [0.0, 500, 1500, "List of Vehicles on the map (short) (org.level filter)"], "isController": false}, {"data": [0.0, 500, 1500, "List of vehicles statuses for map (contractorType&contractorId filter)"], "isController": false}, {"data": [0.0, 500, 1500, "FULL List of Vehicles in the tab on the map (random pageSize and pageNumber)"], "isController": false}, {"data": [0.375, 500, 1500, "List of vehicles statuses for map (org.level filter)"], "isController": false}, {"data": [0.0, 500, 1500, "List of Vehicles in the tab on the map (contractorType&contractorId filter+ random pageSize and pageNumber)"], "isController": false}, {"data": [0.0, 500, 1500, "FULL List of Vehicles on the map (short)"], "isController": false}, {"data": [0.15, 500, 1500, "List of Vehicles (org.level filter + random pageSize and pageNumber)"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 360, 11, 3.0555555555555554, 13693.016666666665, 0, 60868, 11152.0, 31934.700000000015, 51166.39999999998, 60240.73, 1.3649289099526065, 1696.2337677725118, 1.9606412914691944], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["List of Vehicles in the tab on the map (org.level filter + random pageSize and pageNumber)", 20, 0, 0.0, 2276.6000000000004, 529, 3902, 2078.0, 3868.2, 3900.35, 3902.0, 0.0769852573232226, 0.7167974012664075, 0.13372805318718964], "isController": false}, {"data": ["List of Vehicles (random searchText + random pageSize and pageNumber)", 20, 7, 35.0, 49903.149999999994, 23054, 60868, 51634.5, 60378.2, 60844.25, 60868.0, 0.07861882449133621, 0.5845048561865153, 0.14732584210588384], "isController": false}, {"data": ["FULL List of vehicles statuses for map", 20, 0, 0.0, 9265.000000000002, 1961, 17651, 9691.5, 12342.200000000003, 17390.1, 17651.0, 0.07662982049464549, 0.09029447403206958, 0.09503893752753884], "isController": false}, {"data": ["List of vehicles statuses for map (random searchText)", 20, 0, 0.0, 13740.95, 6955, 20560, 14249.5, 19054.200000000004, 20490.8, 20560.0, 0.09708926386920134, 0.11665881861783724, 0.12099654695964969], "isController": false}, {"data": ["List of Vehicles in the tab on the map (random searchText + random pageSize and pageNumber)", 20, 4, 20.0, 44494.450000000004, 29715, 60211, 40633.5, 60182.3, 60209.7, 60211.0, 0.08557394444539526, 0.4933914518582382, 0.1395883184612949], "isController": false}, {"data": ["Login", 20, 0, 0.0, 1151.8999999999999, 713, 1787, 1111.0, 1646.8, 1780.1, 1787.0, 9.765625, 22.785186767578125, 3.5572052001953125], "isController": false}, {"data": ["FULL List of Vehicles (random pageSize and pageNumber)", 20, 0, 0.0, 11813.05, 2471, 22566, 12216.0, 17343.5, 22305.749999999996, 22566.0, 0.0771221112949188, 0.8084829924054001, 0.1440579281048398], "isController": false}, {"data": ["List of Vehicles on the map (short) (random searchText)", 20, 0, 0.0, 18469.700000000004, 11160, 25511, 18610.0, 25048.700000000004, 25495.3, 25511.0, 0.08002816991581037, 20.28081072037357, 0.11680674097282243], "isController": false}, {"data": ["randomPageSize", 20, 0, 0.0, 11.700000000000001, 0, 83, 0.0, 74.60000000000001, 82.6, 83.0, 20.942408376963353, 0.0, 0.0], "isController": false}, {"data": ["List of Vehicles on the map (short) (contractorType&contractorId filter)", 20, 0, 0.0, 11502.75, 3407, 19213, 11361.5, 16662.100000000002, 19087.399999999998, 19213.0, 0.0816536497140081, 415.3735793221828, 0.12351310617628206], "isController": false}, {"data": ["List of Vehicles (contractorType&contractorId filter+ random pageSize and pageNumber)", 20, 0, 0.0, 13076.2, 2447, 22336, 12975.0, 21325.7, 22289.8, 22336.0, 0.0784464465720864, 0.8245456970162894, 0.15112049104533812], "isController": false}, {"data": ["List of Vehicles on the map (short) (org.level filter)", 20, 0, 0.0, 3046.1, 1889, 4715, 2810.5, 4399.3, 4700.099999999999, 4715.0, 0.07933737425026181, 122.18459240919837, 0.12411960307511663], "isController": false}, {"data": ["List of vehicles statuses for map (contractorType&contractorId filter)", 20, 0, 0.0, 8352.1, 2335, 13984, 7958.5, 13133.1, 13941.8, 13984.0, 0.07914116013026636, 0.09556449658308042, 0.10604451739720552], "isController": false}, {"data": ["FULL List of Vehicles in the tab on the map (random pageSize and pageNumber)", 20, 0, 0.0, 20558.05, 8673, 30464, 20142.0, 26491.5, 30266.999999999996, 30464.0, 0.08031644680039356, 0.7558020789410277, 0.1305730515731984], "isController": false}, {"data": ["List of vehicles statuses for map (org.level filter)", 20, 0, 0.0, 1383.6, 363, 2740, 1350.0, 2372.6000000000013, 2724.0499999999997, 2740.0, 0.07832386919913843, 0.09199995104758175, 0.10585960446446055], "isController": false}, {"data": ["List of Vehicles in the tab on the map (contractorType&contractorId filter+ random pageSize and pageNumber)", 20, 0, 0.0, 16009.4, 9597, 23182, 15771.0, 22153.900000000005, 23143.899999999998, 23182.0, 0.08195915155886306, 0.7781237065821395, 0.13788986943907156], "isController": false}, {"data": ["FULL List of Vehicles on the map (short)", 20, 0, 0.0, 19614.3, 9224, 25766, 20161.5, 24478.7, 25703.8, 25766.0, 0.07907076042350299, 1218.3668349864888, 0.11489969874040279], "isController": false}, {"data": ["List of Vehicles (org.level filter + random pageSize and pageNumber)", 20, 0, 0.0, 1805.3, 635, 4013, 1778.5, 2761.800000000001, 3952.649999999999, 4013.0, 0.07737602426512122, 0.8133890082037929, 0.15314634490169377], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 10, 90.9090909090909, 2.7777777777777777], "isController": false}, {"data": ["504/Gateway Timeout", 1, 9.090909090909092, 0.2777777777777778], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 360, 11, "504/Gateway Time-out", 10, "504/Gateway Timeout", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["List of Vehicles (random searchText + random pageSize and pageNumber)", 20, 7, "504/Gateway Time-out", 6, "504/Gateway Timeout", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["List of Vehicles in the tab on the map (random searchText + random pageSize and pageNumber)", 20, 4, "504/Gateway Time-out", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
