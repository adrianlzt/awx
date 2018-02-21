/*************************************************
 * Copyright (c) 2016 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

export default ['$state', '$stateParams', '$scope', 'RelatedHostsFormDefinition', 'ParseTypeChange',
                'GenerateForm', 'HostsService', 'rbacUiControlService', 'GetBasePath', 'ToJSON', 'canAdd',
                function($state, $stateParams, $scope, RelatedHostsFormDefinition, ParseTypeChange,
                         GenerateForm, HostsService, rbacUiControlService, GetBasePath, ToJSON, canAdd) {

        init();

        function init() {
            $scope.canAdd = canAdd;
            $scope.parseType = 'yaml';
            $scope.host = { enabled: true };
            // apply form definition's default field values
            GenerateForm.applyDefaults(RelatedHostsFormDefinition, $scope);

            ParseTypeChange({
                scope: $scope,
                field_id: 'host_host_variables',
                variable: 'host_variables',
                parse_variable: 'parseType'
            });
        }
        $scope.formCancel = function() {
            $state.go('^');
        };
        $scope.toggleHostEnabled = function() {
            if ($scope.host.has_inventory_sources){
                return;
            }
            $scope.host.enabled = !$scope.host.enabled;
        };
        $scope.formSave = function(){
            var json_data = ToJSON($scope.parseType, $scope.host_variables, true);

            // If data is in YAML format, convert to JSON to store in the JSONB field of the database
            if ($scope.parseType === "yaml") {
              json_data = JSON.stringify(jsyaml.load(json_data));
            }

            // If yaml is empty, JSON.stringify will return undefined
            json_data = json_data ? json_data : "{}";

            var params = {
                variables: json_data,// $scope.variables === '---' || $scope.variables === '{}' ? null : $scope.variables,
                name: $scope.name,
                description: $scope.description,
                enabled: $scope.host.enabled,
                inventory: $stateParams.inventory_id
            };
            HostsService.post(params).then(function(res) {
                $state.go('^.edit', { host_id: res.data.id }, { reload: true });
            })
            .catch(function(){});
        };
    }
];
