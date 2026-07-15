export interface DeleteAccountRepository {
    delete(id: string): Promise<boolean>;
}
