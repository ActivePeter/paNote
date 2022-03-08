class CardSetManager{
    cardsets={};
    add_card_set(name){
        if(name in this.cardsets){
            return;
        }
        this.cardsets[name]={
            value:name,
            next_card_id:0,
            cards:{
            }
        }
    }
    // eslint-disable-next-line no-unused-vars
    new_card_in_card_set(cardfront,cardback){

    }
}
class ReviewPartManager{
    card_set_man
    constructor() {
        this.card_set_man=new CardSetManager()
    }
}
let ReviewPartGuiMode={
    ReviewCards:'review_cards',
    AddCardSet:'add_card_set',
    AddNewCard:'add_new_card'
}
export default {
    ReviewPartManager,
    ReviewPartGuiMode
}