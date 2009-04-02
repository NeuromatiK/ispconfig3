<?php

/*
 Config of the Module
 */
$module["name"] 		= "monitor";
$module["title"] 		= "Monitor";
$module["template"] 	= "module.tpl.htm";
$module["tab_width"]    = '';
$module["startpage"] 	= "monitor/show_sys_state.php?state=system";

unset($items);
$items[] = array( 'title' 	=> "Show Overview",
                  'target' 	=> 'content',
                  'link'	=> 'monitor/show_sys_state.php?state=system');

$items[] = array( 'title' 	=> "Show System-Log",
                  'target' 	=> 'content',
                  'link'	=> 'monitor/log_list.php');

$items[] = array( 'title' 	=> 'Show Jobqueue',
				  'target' 	=> 'content',
				  'link'	=> 'monitor/datalog_list.php');

$module["nav"][] = array(	'title'	=> 'System State (All Servers)',
                            'open' 	=> 1,
                            'items'	=> $items);


/*
 We need all the available servers on the left navigation.
 So fetch them from the database and add then to the navigation as dropdown-list
*/

$servers = $app->db->queryAllRecords("SELECT server_id, server_name FROM server order by server_name");

$dropDown = "<select id='server_id' onchange=\"loadContent('monitor/show_sys_state.php?state=server&server=' + document.getElementById('server_id').value);\">";
foreach ($servers as $server)
{
    $dropDown .= "<option value='" . $server['server_id'] . "|" . $server['server_name'] . "'>" . $server['server_name'] . "</option>";
}
$dropDown .= "</select>";

/*
 Now add them as dropdown to the navigation
 */
unset($items);
$items[] = array( 'title' 	=> $dropDown,
        'target' 	=> '', // no action!
        'link'	=> '');   // no action!

$module["nav"][] = array(	'title'	=> 'Server to Monitor',
        'open' 	=> 1,
        'items'	=> $items);

/*
  The first Server at the list is the server first selected
 */
$_SESSION['monitor']['server_id']   = $servers[0]['server_id'];
$_SESSION['monitor']['server_name'] = $servers[0]['server_name'];

/*
 * Clear and set the Navigation-Items
 */
unset($items);

$items[] = array( 'title' 	=> "Show CPU info",
        'target' 	=> 'content',
        'link'	=> 'monitor/show_data.php?type=cpu_info');

$module["nav"][] = array(	'title'	=> 'Hardware-Information',
        'open' 	=> 1,
        'items'	=> $items);

/*
 * Clear and set the Navigation-Items
 */
unset($items);
$items[] = array( 'title' 	=> "Show Overview",
                  'target' 	=> 'content',
                  'link'	=> 'monitor/show_sys_state.php?state=server');

$items[] = array( 'title' 	=> "Show Update State",
                  'target' 	=> 'content',
                  'link'	=> 'monitor/show_data.php?type=system_update');

$items[] = array( 'title' 	=> "Show RAID state",
                  'target' 	=> 'content',
                  'link'	=> 'monitor/show_data.php?type=raid_state');

$items[] = array( 'title' 	=> "Show Server load",
                  'target' 	=> 'content',
                  'link'	=> 'monitor/show_data.php?type=server_load');

$items[] = array( 'title' 	=> "Show Disk usage",
                  'target' 	=> 'content',
                  'link'	=> 'monitor/show_data.php?type=disk_usage');

$items[] = array( 'title' 	=> "Show Memory usage",
                  'target' 	=> 'content',
                  'link'	=> 'monitor/show_data.php?type=mem_usage');

$items[] = array( 'title' 	=> "Show Services",
                  'target' 	=> 'content',
                  'link'	=> 'monitor/show_data.php?type=services');


$module["nav"][] = array(	'title'	=> 'Server State',
                            'open' 	=> 1,
                            'items'	=> $items);

/*
 * Clear and set the Navigation-Items
 */
unset($items);

$items[] = array( 'title' 	=> "Show System-Log",
                  'target' 	=> 'content',
                  'link'	=> 'monitor/show_log.php?log=log_messages');

$items[] = array( 'title' 	=> "Show ISPC Cron-Log",
                  'target' 	=> 'content',
                  'link'	=> 'monitor/show_log.php?log=log_ispc_cron');

$items[] = array( 'title' 	=> "Show RKHunter-Log",
                  'target' 	=> 'content',
                  'link'	=> 'monitor/show_data.php?type=rkhunter');

$items[] = array( 'title' 	=> "Show fail2ban-Log",
                  'target' 	=> 'content',
                  'link'	=> 'monitor/show_data.php?type=fail2ban');

$module["nav"][] = array(	'title'	=> 'Logfiles',
                            'open' 	=> 1,
                            'items'	=> $items);
?>