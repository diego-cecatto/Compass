import { gql } from '@apollo/client';
import { BaseAction } from './base.actions';

export class DocumentationActions extends BaseAction {
    public static all() {
        return gql`
            query ScopedComponents($scope: String!) {
                components(scope: $scope) {
                    name
                    description
                    prop {
                        name
                    }
                }
            }
        `;
    }
}
