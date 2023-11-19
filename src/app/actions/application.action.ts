// @ts-ignore
import { gql } from '@apollo/client';
import { BaseAction } from './Base.actions';

export class ApplicationAction extends BaseAction {
    public static name() {
        return gql`
            query ApplicationName {
                documentationName
            }
        `;
    }
}
