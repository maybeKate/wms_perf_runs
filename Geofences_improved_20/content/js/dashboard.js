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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3421875, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3, 500, 1500, "List of POIs on the map (short) (random searchText)"], "isController": false}, {"data": [0.525, 500, 1500, "List of Zones (org.level filter + random pageSize and pageNumber)"], "isController": false}, {"data": [0.0, 500, 1500, "List of Zones (random searchText + random pageSize and pageNumber)"], "isController": false}, {"data": [0.1, 500, 1500, "List of POIs (random searchText + random pageSize and pageNumber)"], "isController": false}, {"data": [0.575, 500, 1500, "Login"], "isController": false}, {"data": [0.675, 500, 1500, "List of POIs on the map (short) (org.level filter)"], "isController": false}, {"data": [0.0, 500, 1500, "FULL List of Zones (random pageSize and pageNumber)"], "isController": false}, {"data": [1.0, 500, 1500, "randomPageSize"], "isController": false}, {"data": [0.65, 500, 1500, "List of Zones on the map (short) (org.level filter)"], "isController": false}, {"data": [0.25, 500, 1500, "FULL List of POIs on the map (short)"], "isController": false}, {"data": [0.0, 500, 1500, "FULL List of POIs (random pageSize and pageNumber)"], "isController": false}, {"data": [0.525, 500, 1500, "List of POIs (org.level filter + random pageSize and pageNumber)"], "isController": false}, {"data": [0.15, 500, 1500, "List of Zones (contractorType&contractorId filter+ random pageSize and pageNumber)"], "isController": false}, {"data": [0.125, 500, 1500, "FULL List of Zones on the map (short)"], "isController": false}, {"data": [0.475, 500, 1500, "List of Zones on the map (short) (contractorType&contractorId filter)"], "isController": false}, {"data": [0.125, 500, 1500, "List of Zones on the map (short) (random searchText)"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 320, 0, 0.0, 1646.0593750000005, 0, 5862, 1296.5, 3431.7000000000003, 4405.349999999999, 5438.080000000005, 10.54991428194646, 3420.918656451932, 13.825255711789529], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["List of POIs on the map (short) (random searchText)", 20, 0, 0.0, 1501.1999999999998, 619, 2979, 1397.0, 2519.2000000000007, 2957.2, 2979.0, 0.7438815740534107, 120.62450165746114, 0.8962174784274344], "isController": false}, {"data": ["List of Zones (org.level filter + random pageSize and pageNumber)", 20, 0, 0.0, 793.8, 331, 1362, 697.0, 1206.9, 1354.3, 1362.0, 0.6927846478922026, 5.712733327704458, 1.2368641535903564], "isController": false}, {"data": ["List of Zones (random searchText + random pageSize and pageNumber)", 20, 0, 0.0, 4281.9, 1930, 5779, 4387.0, 5465.8, 5764.599999999999, 5779.0, 0.75125835774923, 6.06098222334911, 1.2607054315979265], "isController": false}, {"data": ["List of POIs (random searchText + random pageSize and pageNumber)", 20, 0, 0.0, 2246.55, 1316, 3958, 2297.5, 3264.800000000001, 3925.2999999999993, 3958.0, 0.7950073538180229, 3.2539402551973606, 1.2544657053702746], "isController": false}, {"data": ["Login", 20, 0, 0.0, 567.0499999999998, 339, 665, 592.0, 651.7, 664.45, 665.0, 12.987012987012989, 30.279778814935064, 4.743303571428571], "isController": false}, {"data": ["List of POIs on the map (short) (org.level filter)", 20, 0, 0.0, 574.15, 300, 962, 597.5, 914.0000000000005, 960.6, 962.0, 0.7262427829623443, 155.20035222774973, 0.9531936526380769], "isController": false}, {"data": ["FULL List of Zones (random pageSize and pageNumber)", 20, 0, 0.0, 3093.4999999999995, 1876, 5862, 2852.0, 4602.900000000001, 5799.499999999999, 5862.0, 0.7769102280231519, 6.455676361049606, 1.3005659305442256], "isController": false}, {"data": ["randomPageSize", 20, 0, 0.0, 1.0, 0, 10, 1.0, 1.0, 9.549999999999994, 10.0, 18.90359168241966, 0.0, 0.0], "isController": false}, {"data": ["List of Zones on the map (short) (org.level filter)", 20, 0, 0.0, 584.6500000000001, 239, 1051, 623.0, 990.9000000000004, 1048.95, 1051.0, 0.7920478396895173, 175.46883972416933, 1.0457506633400657], "isController": false}, {"data": ["FULL List of POIs on the map (short)", 20, 0, 0.0, 1542.4999999999998, 752, 3099, 1479.0, 2947.800000000002, 3095.85, 3099.0, 0.7294744136849399, 931.1813553178685, 0.876224149250465], "isController": false}, {"data": ["FULL List of POIs (random pageSize and pageNumber)", 20, 0, 0.0, 2918.0, 1860, 4580, 2689.0, 4404.7, 4571.3, 4580.0, 0.7637668983426258, 6.055798840506378, 1.2688674291606201], "isController": false}, {"data": ["List of POIs (org.level filter + random pageSize and pageNumber)", 20, 0, 0.0, 853.7, 486, 1462, 773.5, 1298.4000000000003, 1454.6999999999998, 1462.0, 0.7732158045310445, 6.133247433890049, 1.3706458285007346], "isController": false}, {"data": ["List of Zones (contractorType&contractorId filter+ random pageSize and pageNumber)", 20, 0, 0.0, 2165.75, 994, 5148, 1874.5, 3702.8000000000006, 5077.3499999999985, 5148.0, 0.7499625018749063, 6.270609321096446, 1.296981049385031], "isController": false}, {"data": ["FULL List of Zones on the map (short)", 20, 0, 0.0, 2080.9, 818, 3927, 2108.5, 3089.5000000000005, 3886.0499999999993, 3927.0, 0.6719075455217361, 1481.5428178332663, 0.8123257239803804], "isController": false}, {"data": ["List of Zones on the map (short) (contractorType&contractorId filter)", 20, 0, 0.0, 1102.1499999999999, 489, 3662, 953.5, 1957.2, 3577.049999999999, 3662.0, 0.7010164738871364, 510.63494704039607, 0.8853755914826498], "isController": false}, {"data": ["List of Zones on the map (short) (random searchText)", 20, 0, 0.0, 2030.15, 849, 3987, 1914.0, 3132.5, 3944.2999999999993, 3987.0, 0.8200082000820008, 266.9844598836613, 0.9943400215252153], "isController": false}]}, function(index, item){
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
