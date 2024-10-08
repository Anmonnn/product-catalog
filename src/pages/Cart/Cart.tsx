import { useEffect, useState } from 'react';
import { CartsCard } from '../../components/CartsCard/CartsCard';
import './Cart.scss';
import { ButtonBack } from '../../components/ButtonBack/ButtonBack';
import { TypeCard } from '../../types/TypeCard';
import { useAppSelector } from '../../store';

export const Cart = () => {
  const phonesCart = useAppSelector(state => state.cartPhones.phonesInCart);
  const [cart, setCart] = useState(phonesCart);

  useEffect(() => {
    setCart(phonesCart);
  }, [phonesCart]);

  return (
    <div className="Cart">
      <ButtonBack />

      <h1>Cart</h1>

      <div className="main-container">
        {cart.length ? (
          <>
            <ul className="phones__list">
              {cart.map(phone => (
                <CartsCard phone={phone} key={phone.id} />
              ))}
            </ul>

            <div className="phones-price">
              <h2 data-cy="productQauntity">
                {`$${cart.reduce((accumulator: number, value: TypeCard) => {
                  return accumulator + value.price * value.countToSell;
                }, 0)}`}
              </h2>
              <p>{`Total for ${cart.length} items`}</p>

              <div className="button__container">
                <button type="button">Checkout</button>
              </div>
            </div>
          </>
        ) : (
          <p>Your cart is empty</p>
        )}
      </div>
    </div>
  );
};
