// @ts-ignore
import { gql } from '@apollo/client';
import { BaseAction } from './Base.actions';

export class MenuActions extends BaseAction {
    public static all() {
        //     const query =  gql`
        //         fragment ComponentWithChilds on Component {
        //             name
        //             childs {
        //                 ...ComponentWithChilds
        //             }
        //         }
        //         query GetComponents($componentName: String!) {
        //             component(name: $componentName) {
        //                 ...ComponentWithChilds
        //             }
        //         }
        //     `;

        //     graphql(CurrentUserForLayout, {
        //         options: { variables: { avatarID: 1 } },
        //       })(Profile);
        // }
        return gql`
            query ScopedComponents($scope: String) {
                components(scope: $scope) {
                    name
                    description
                    path
                    prop {
                        name
                        properties {
                            name
                            description
                            type
                            default
                        }
                    }
                }
            }
        `;
    }
}
