// @ts-ignore
import { gql } from '@apollo/client';
import { BaseAction } from './Base.actions';

export class DocumentationAction extends BaseAction {
    public static getDocumentation() {
        return gql`
            query ScopedDocument($filePath: String!) {
                documentation(filePath: $filePath)
            }
        `;
    }

    public static getDefaultDocumentation() {
        return gql`
            query ScopedDocument {
                documentationDefault
            }
        `;
    }
}
