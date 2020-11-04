export class infoSaldoModel {
    public noRekening: string
    public namaPemilik: string
    public saldo: number

    constructor(data: infoSaldoModel = null) {
        if (data != null) {
            this.noRekening = data.noRekening
            this.saldo = data.saldo
            this.namaPemilik = data.namaPemilik
        }
    }
}

export class infoAccountModel {
    public noRekening: string
    public namaPemilik: string
    public namaIbu: string
    public alamat: string
    public ttl: string
    public saldo: number

    constructor(data: infoAccountModel = null) {
        if (data != null) {
            this.noRekening = data.noRekening
            this.namaPemilik = data.namaPemilik
            this.namaIbu = data.namaIbu
            this.alamat = data.alamat
            this.ttl = data.ttl
            this.saldo = data.saldo
        }
    }
}

export class infoHistoryModel {
    public debet: number
    public kredit: number
    public saldo: number
    public historyItem: Array<infoHistoryItemModel>
    public provider: string

    constructor(data: infoHistoryModel = null) {
        if (data != null) {
            this.debet = data.debet
            this.kredit = data.kredit
            this.saldo = data.saldo
            this.historyItem = data.historyItem
            this.provider = data.provider
        }
    }
}

export class infoHistoryItemModel {
    public codeDate: string
    public nominal: number
    public keterangan: string

    constructor(data: infoHistoryItemModel = null) {
        if (data != null) {
            this.codeDate = data.codeDate
            this.nominal = data.nominal
            this.keterangan = data.keterangan
        }
    }
}

export class infoIuranModel {
    public tagihan: number
    public iuran: number
    public tunggakan: number
    public keterangan: string
    public accNumber: string

    constructor(data: infoIuranModel = null) {
        if (data != null) {
            this.tagihan = data.tagihan
            this.iuran = data.iuran
            this.tunggakan = data.tunggakan
            this.keterangan = data.keterangan
            this.accNumber = data.accNumber
        }
    }
}