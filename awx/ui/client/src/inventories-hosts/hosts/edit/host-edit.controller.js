/*************************************************
 * Copyright (c) 2016 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

 export default
 	['$scope', '$state', '$stateParams', 'GenerateForm', 'ParseTypeChange', 'HostsService', 'host', '$rootScope',
 	function($scope, $state, $stateParams, GenerateForm, ParseTypeChange, HostsService, host, $rootScope){
 		$scope.parseType = 'yaml';
 		$scope.formCancel = function(){
 			$state.go('^', null, {reload: true});
 		};
 		$scope.toggleHostEnabled = function(){
			if ($scope.host.has_inventory_sources){
				return;
			}
 			$scope.host.enabled = !$scope.host.enabled;
 		};
 		$scope.toggleEnabled = function(){
 			$scope.host.enabled = !$scope.host.enabled;
 		};
        $scope.groupsTab = function(){
            let id = $scope.host.summary_fields.inventory.id;
            $state.go('hosts.edit.nested_groups', {inventory_id: id});
        };
 		$scope.formSave = function(){
			// If data is in YAML format, convert to JSON to store in the JSONB field of the database
			if ($scope.parseType === "yaml") {
			  $scope.variables = JSON.stringify(jsyaml.load($scope.variables));
			}

			// If yaml is empty, JSON.stringify will return the string "null". We set in the database an empty json
			$scope.variables = $scope.variables === "null" ? "{}" : $scope.variables

 			var host = {
 				id: $scope.host.id,
				variables: $scope.variables,
 				name: $scope.name,
 				description: $scope.description,
 				enabled: $scope.host.enabled
 			};
 			HostsService.put(host).then(function(){
 				$state.go('.', null, {reload: true});
 			});

 		};
 		var init = function(){
 			$scope.host = host.data;
 			$rootScope.breadcrumb.host_name = host.data.name;
			$scope.name = host.data.name;
 			$scope.description = host.data.description;
			$scope.variables = getVars(JSON.stringify(host.data.variables));
			ParseTypeChange({
				scope: $scope,
				field_id: 'host_variables',
				variable: 'variables',
			});
 		};

		// Adding this function b/c sometimes extra vars are returned to the
		// UI as a string (ex: "foo: bar"), and other times as a
		// json-object-string (ex: "{"foo": "bar"}"). CodeMirror wouldn't know
		// how to prettify the latter. The latter occurs when host vars were
		// system generated and not user-input (such as adding a cloud host);
		function getVars(str){

			// Quick function to test if the host vars are a json-object-string,
			// by testing if they can be converted to a JSON object w/o error.
			function IsJsonString(str) {
				try {
					JSON.parse(str);
				} catch (e) {
					return false;
				}
				return true;
			}

			// If stored value in the database is empty ('{}'), return an empty yaml
			if(str === '{}'){
				return '---';
			}
			else if(IsJsonString(str)){
				str = JSON.parse(str);
				return jsyaml.safeDump(str);
			}
			else if(!IsJsonString(str)){
				return str;
			}
		}

 		init();
 	}];
