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

    var data = {"OkPercent": 99.44444444444444, "KoPercent": 0.5555555555555556};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.14722222222222223, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.05, 500, 1500, "List of Vehicles in the tab on the map (org.level filter + random pageSize and pageNumber)"], "isController": false}, {"data": [0.0, 500, 1500, "List of Vehicles (random searchText + random pageSize and pageNumber)"], "isController": false}, {"data": [0.025, 500, 1500, "FULL List of vehicles statuses for map"], "isController": false}, {"data": [0.0, 500, 1500, "List of vehicles statuses for map (random searchText)"], "isController": false}, {"data": [0.0, 500, 1500, "List of Vehicles in the tab on the map (random searchText + random pageSize and pageNumber)"], "isController": false}, {"data": [0.525, 500, 1500, "Login"], "isController": false}, {"data": [0.0, 500, 1500, "FULL List of Vehicles (random pageSize and pageNumber)"], "isController": false}, {"data": [0.0, 500, 1500, "List of Vehicles on the map (short) (random searchText)"], "isController": false}, {"data": [0.925, 500, 1500, "randomPageSize"], "isController": false}, {"data": [0.0, 500, 1500, "List of Vehicles on the map (short) (contractorType&contractorId filter)"], "isController": false}, {"data": [0.025, 500, 1500, "List of Vehicles (contractorType&contractorId filter+ random pageSize and pageNumber)"], "isController": false}, {"data": [0.025, 500, 1500, "List of Vehicles on the map (short) (org.level filter)"], "isController": false}, {"data": [0.125, 500, 1500, "List of vehicles statuses for map (contractorType&contractorId filter)"], "isController": false}, {"data": [0.0, 500, 1500, "FULL List of Vehicles in the tab on the map (random pageSize and pageNumber)"], "isController": false}, {"data": [0.375, 500, 1500, "List of vehicles statuses for map (org.level filter)"], "isController": false}, {"data": [0.0, 500, 1500, "FULL List of Vehicles on the map (short)"], "isController": false}, {"data": [0.0, 500, 1500, "List of Vehicles in the tab on the map (contractorType&contractorId filter+ random pageSize and pageNumber)"], "isController": false}, {"data": [0.575, 500, 1500, "List of Vehicles (org.level filter + random pageSize and pageNumber)"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 360, 2, 0.5555555555555556, 9645.074999999999, 0, 60508, 5343.0, 20090.600000000002, 41260.24999999999, 57974.67999999998, 1.9177089770088003, 2445.1868636352438, 2.7560251769219706], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["List of Vehicles in the tab on the map (org.level filter + random pageSize and pageNumber)", 20, 0, 0.0, 2569.55, 937, 3645, 2670.5, 3481.2000000000003, 3637.7, 3645.0, 0.11385955423984515, 1.1832164790356097, 0.1978921305257465], "isController": false}, {"data": ["List of Vehicles (random searchText + random pageSize and pageNumber)", 20, 1, 5.0, 32996.5, 14679, 60508, 30407.5, 58796.8, 60430.5, 60508.0, 0.11204356253711444, 0.989621483582817, 0.21031692747140088], "isController": false}, {"data": ["FULL List of vehicles statuses for map", 20, 0, 0.0, 4530.500000000001, 1191, 8623, 4478.0, 6959.200000000001, 8540.749999999998, 8623.0, 0.10953022486555165, 0.133056760958499, 0.13595011308995716], "isController": false}, {"data": ["List of vehicles statuses for map (random searchText)", 20, 0, 0.0, 8707.550000000001, 2309, 13670, 9697.5, 12662.5, 13619.75, 13670.0, 0.10915779304774016, 0.13154366857510874, 0.1360954632656737], "isController": false}, {"data": ["List of Vehicles in the tab on the map (random searchText + random pageSize and pageNumber)", 20, 1, 5.0, 41345.200000000004, 14507, 60163, 41844.5, 54311.00000000001, 59886.899999999994, 60163.0, 0.1112557435777622, 0.909119137865336, 0.18154025580476843], "isController": false}, {"data": ["Login", 20, 0, 0.0, 605.0, 368, 755, 598.5, 716.7000000000002, 753.4499999999999, 755.0, 12.376237623762377, 28.859959970606432, 4.520227413366336], "isController": false}, {"data": ["FULL List of Vehicles (random pageSize and pageNumber)", 20, 0, 0.0, 7057.450000000001, 1602, 9391, 7657.0, 9010.300000000001, 9373.0, 9391.0, 0.11024993660628644, 1.2823338085564975, 0.20604571892605536], "isController": false}, {"data": ["List of Vehicles on the map (short) (random searchText)", 20, 0, 0.0, 14229.399999999998, 4837, 20051, 14645.0, 19698.100000000002, 20041.4, 20051.0, 0.11627230974943317, 43.09266403479449, 0.17002554357304808], "isController": false}, {"data": ["randomPageSize", 20, 0, 0.0, 227.19999999999996, 0, 525, 189.0, 524.0, 524.95, 525.0, 21.551724137931036, 0.0, 0.0], "isController": false}, {"data": ["List of Vehicles on the map (short) (contractorType&contractorId filter)", 20, 0, 0.0, 12083.849999999999, 3630, 18209, 12863.0, 16554.9, 18133.8, 18209.0, 0.1092955899229466, 593.4515077668178, 0.16474388969342585], "isController": false}, {"data": ["List of Vehicles (contractorType&contractorId filter+ random pageSize and pageNumber)", 20, 0, 0.0, 3940.2500000000005, 1059, 6521, 3857.5, 6451.9000000000015, 6520.9, 6521.0, 0.10852931919558069, 1.2633279091284009, 0.2084843982320574], "isController": false}, {"data": ["List of Vehicles on the map (short) (org.level filter)", 20, 0, 0.0, 2811.2500000000005, 1357, 4612, 2750.0, 4147.1, 4590.049999999999, 4612.0, 0.11055281937327606, 171.3345543374017, 0.17306266548375152], "isController": false}, {"data": ["List of vehicles statuses for map (contractorType&contractorId filter)", 20, 0, 0.0, 3556.9999999999995, 861, 6782, 3880.5, 5783.600000000001, 6734.549999999999, 6782.0, 0.12302241468395542, 0.1490805804505081, 0.165966127700342], "isController": false}, {"data": ["FULL List of Vehicles in the tab on the map (random pageSize and pageNumber)", 20, 0, 0.0, 11726.300000000001, 4134, 16153, 11830.0, 15630.2, 16127.8, 16153.0, 0.11123346792582953, 1.165474730536924, 0.18094448163813528], "isController": false}, {"data": ["List of vehicles statuses for map (org.level filter)", 20, 0, 0.0, 1246.35, 707, 2519, 1143.5, 1696.5, 2477.8999999999996, 2519.0, 0.12784535825465515, 0.15455055564788833, 0.17291584099872795], "isController": false}, {"data": ["FULL List of Vehicles on the map (short)", 20, 0, 0.0, 16753.1, 7342, 21139, 17493.0, 20677.0, 21118.7, 21139.0, 0.11272241541591753, 1748.3532895306944, 0.1639098403850598], "isController": false}, {"data": ["List of Vehicles in the tab on the map (contractorType&contractorId filter+ random pageSize and pageNumber)", 20, 0, 0.0, 8439.05, 2034, 14042, 8461.0, 12198.2, 13953.599999999999, 14042.0, 0.1145311381531854, 1.212659940944882, 0.192516329634932], "isController": false}, {"data": ["List of Vehicles (org.level filter + random pageSize and pageNumber)", 20, 0, 0.0, 785.85, 416, 1423, 732.0, 1240.6000000000004, 1414.6499999999999, 1423.0, 0.11233430689732644, 1.3089415036649068, 0.22244715899516965], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 2, 100.0, 0.5555555555555556], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 360, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["List of Vehicles (random searchText + random pageSize and pageNumber)", 20, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["List of Vehicles in the tab on the map (random searchText + random pageSize and pageNumber)", 20, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
