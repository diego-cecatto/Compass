// @ts-ignore
import { gql } from '@apollo/client';
import { BaseAction } from './Base.actions';

export class ComponentAction extends BaseAction {
    public static menuItems() {
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
                    docPath
                    basePath
                    props
                }
            }
        `;
    }

    public static get() {
        return gql`
            query ScopedComponents($filePath: String!) {
                component(filePath: $filePath) {
                    name
                    version
                    description
                    docPath
                    basePath
                    props
                }
            }
        `;
    }
}
