class CardSet{
    value:string=""
    next_card_id:Number=0
    cards:any={}
    constructor(name:string) {
        this.value=name
    }
}

class CardSetManager{
    cardsets:any={}//:Map<string,CardSet>=new Map();
    add_card_set(name:string){
        if(name in this.cardsets){
            return;
        }
        this.cardsets[name]=new CardSet(name);
    }

    // eslint-disable-next-line no-unused-vars
    new_card_in_card_set(cardfront:Object,cardback:Object){

    }
}
class ReviewPartManager{
    card_set_man
    constructor() {
        this.card_set_man=new CardSetManager()
    }
}
const ReviewPartGuiMode:Object={
    ReviewCards:'review_cards',
    AddCardSet:'add_card_set',
    AddNewCard:'add_new_card'
}
export default {
    ReviewPartManager,
    ReviewPartGuiMode
}