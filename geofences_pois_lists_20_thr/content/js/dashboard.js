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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.353125, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.725, 500, 1500, "List of Zones (org.level filter + random pageSize and pageNumber)"], "isController": false}, {"data": [0.225, 500, 1500, "List of POIs on the map (short) (random searchText)"], "isController": false}, {"data": [0.0, 500, 1500, "List of POIs (random searchText + random pageSize and pageNumber)"], "isController": false}, {"data": [0.0, 500, 1500, "List of Zones (random searchText + random pageSize and pageNumber)"], "isController": false}, {"data": [0.5, 500, 1500, "Login"], "isController": false}, {"data": [0.625, 500, 1500, "List of POIs on the map (short) (org.level filter)"], "isController": false}, {"data": [0.275, 500, 1500, "FULL List of Zones (random pageSize and pageNumber)"], "isController": false}, {"data": [1.0, 500, 1500, "randomPageSize"], "isController": false}, {"data": [0.025, 500, 1500, "FULL List of POIs on the map (short)"], "isController": false}, {"data": [0.725, 500, 1500, "List of Zones on the map (short) (org.level filter)"], "isController": false}, {"data": [0.075, 500, 1500, "FULL List of POIs (random pageSize and pageNumber)"], "isController": false}, {"data": [0.8, 500, 1500, "List of POIs (org.level filter + random pageSize and pageNumber)"], "isController": false}, {"data": [0.375, 500, 1500, "List of Zones (contractorType&contractorId filter+ random pageSize and pageNumber)"], "isController": false}, {"data": [0.0, 500, 1500, "FULL List of Zones on the map (short)"], "isController": false}, {"data": [0.25, 500, 1500, "List of Zones on the map (short) (contractorType&contractorId filter)"], "isController": false}, {"data": [0.05, 500, 1500, "List of Zones on the map (short) (random searchText)"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 320, 0, 0.0, 1547.943749999999, 0, 5041, 1301.0, 2945.3000000000006, 3548.0999999999995, 4687.4000000000015, 11.845271145659819, 3847.48891674764, 15.529024673792337], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["List of Zones (org.level filter + random pageSize and pageNumber)", 20, 0, 0.0, 525.8, 331, 769, 529.0, 756.3000000000003, 768.95, 769.0, 0.8262755629002272, 8.249038163602561, 1.4746275304689116], "isController": false}, {"data": ["List of POIs on the map (short) (random searchText)", 20, 0, 0.0, 1709.8500000000001, 851, 2852, 1511.5, 2736.1000000000004, 2847.15, 2852.0, 0.8374858674259872, 144.9351897167204, 1.007927327163854], "isController": false}, {"data": ["List of POIs (random searchText + random pageSize and pageNumber)", 20, 0, 0.0, 2791.9, 1851, 4335, 2703.5, 3729.0, 4305.049999999999, 4335.0, 0.886328384666519, 3.076788582982495, 1.3983907600265897], "isController": false}, {"data": ["List of Zones (random searchText + random pageSize and pageNumber)", 20, 0, 0.0, 3623.5499999999997, 2318, 5041, 3578.5, 4884.5, 5034.2, 5041.0, 0.7979253939756633, 7.5550443846000395, 1.3381614053461002], "isController": false}, {"data": ["Login", 20, 0, 0.0, 696.4499999999998, 517, 844, 688.5, 841.9, 843.95, 844.0, 12.547051442910917, 29.26808049717691, 4.570361511919699], "isController": false}, {"data": ["List of POIs on the map (short) (org.level filter)", 20, 0, 0.0, 653.4, 356, 1018, 668.0, 940.9000000000001, 1014.3, 1018.0, 0.8397363227946425, 179.41540575009446, 1.1013338686652392], "isController": false}, {"data": ["FULL List of Zones (random pageSize and pageNumber)", 20, 0, 0.0, 1486.6499999999999, 615, 2407, 1402.0, 2117.4, 2392.85, 2407.0, 0.8052826542116283, 8.110824194214045, 1.3475115507730715], "isController": false}, {"data": ["randomPageSize", 20, 0, 0.0, 0.8500000000000002, 0, 13, 0.0, 1.0, 12.399999999999991, 13.0, 21.528525296017225, 0.0, 0.0], "isController": false}, {"data": ["FULL List of POIs on the map (short)", 20, 0, 0.0, 2221.5, 1408, 2965, 2290.0, 2889.5000000000005, 2962.2, 2965.0, 0.7880220646178093, 1005.9356376822301, 0.9457803881008668], "isController": false}, {"data": ["List of Zones on the map (short) (org.level filter)", 20, 0, 0.0, 576.5999999999999, 253, 1077, 555.0, 885.9000000000002, 1067.85, 1077.0, 0.8927375797884212, 197.70597827299918, 1.1778207717716378], "isController": false}, {"data": ["FULL List of POIs (random pageSize and pageNumber)", 20, 0, 0.0, 2067.0000000000005, 936, 2947, 2106.5, 2844.4, 2941.95, 2947.0, 0.9397613006296401, 8.913874547739875, 1.5642804071515835], "isController": false}, {"data": ["List of POIs (org.level filter + random pageSize and pageNumber)", 20, 0, 0.0, 495.29999999999995, 295, 1052, 494.5, 605.5000000000001, 1029.9499999999998, 1052.0, 0.8969012063321224, 8.506678760818872, 1.5927879333153954], "isController": false}, {"data": ["List of Zones (contractorType&contractorId filter+ random pageSize and pageNumber)", 20, 0, 0.0, 1267.9, 628, 1857, 1279.5, 1729.5, 1850.6499999999999, 1857.0, 0.9262260917890057, 9.456099054091604, 1.6110364180521466], "isController": false}, {"data": ["FULL List of Zones on the map (short)", 20, 0, 0.0, 2583.4499999999994, 1778, 3672, 2521.0, 3126.3, 3645.1499999999996, 3672.0, 0.8060290976504252, 1777.301716841978, 0.973689447064039], "isController": false}, {"data": ["List of Zones on the map (short) (contractorType&contractorId filter)", 20, 0, 0.0, 1644.1, 705, 3225, 1487.5, 2821.2000000000003, 3205.3999999999996, 3225.0, 0.7754041794285271, 581.8884741620789, 0.9806515454774551], "isController": false}, {"data": ["List of Zones on the map (short) (random searchText)", 20, 0, 0.0, 2422.7999999999997, 1208, 3561, 2418.0, 3410.6000000000004, 3554.15, 3561.0, 0.8543357539513029, 249.75442018635198, 1.0352146518581802], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 320, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
