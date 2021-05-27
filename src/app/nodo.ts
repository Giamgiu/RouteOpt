export class Nodo {
  private _visitato: boolean = false;

  constructor(
    public readonly lat: number,
    public readonly lng: number,
    //public starter: boolean = false,
  ) {

  }


  public get visitato(): boolean {
    return this._visitato;
  }
  public set visitato(value: boolean) {
    this._visitato = value;
  }
}
