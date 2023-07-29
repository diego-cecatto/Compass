import { gql } from '@apollo/client';
import { BaseAction } from './base.actions';

export class DocumentationAction extends BaseAction {
    public static getDocumentation() {
        return gql`
            query ScopedDocument($path: String!) {
                documentation(path: $path)
            }
        `;
    }
}
