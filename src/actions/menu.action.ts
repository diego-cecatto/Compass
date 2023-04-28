import { gql } from '@apollo/client';
import { BaseAction } from './base.actions';

export class MenuActions extends BaseAction {
    public static all() {
        //   return gql`
        //     fragment ComponentWithChilds on Component {
        //       name
        //       childs {
        //         ...ComponentWithChilds
        //       }
        //     }
        //     query GetComponents($componentName: String!) {
        //       component(name: $componentName) {
        //         ...ComponentWithChilds
        //       }
        //     }
        //   `;
    }
}
