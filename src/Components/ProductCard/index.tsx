import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { format, formatDistanceToNow } from 'date-fns'; // eslint-disable-line
import br from 'date-fns/locale/pt-BR' // eslint-disable-line
import NumberFormat from 'react-number-format';

import { getMultipleStores } from '../../Functions/Settings';

import {
    Container,
    Card,
    ProductDetails,
    ProductDetailsContainer,
    ProductName,
    ProductCode,
    ProductLote,
    ProductStore,
    ProductExpDate,
    LoteDetailsContainer,
    AmountContainer,
    AmountContainerText,
    Amount,
    PriceContainer,
    PriceContainerText,
    Price,
} from './styles';

interface Request {
    product: IProduct;

    expired: boolean;
    nextToExp: boolean;
}
const Product = ({ product, expired, nextToExp }: Request) => {
    const navigation = useNavigation();
    const [multipleStoresState, setMultipleStoresState] = useState<boolean>();
    const [totalPrice, setTotalPrice] = useState(0);

    const expiredOrNext = !!(expired || nextToExp);

    useEffect(() => {
        getMultipleStores().then((data) => {
            setMultipleStoresState(data);
        });
    }, []);

    useEffect(() => {
        if (product.lotes[0]) {
            if (product.lotes[0].amount && product.lotes[0].price) {
                setTotalPrice(product.lotes[0].price * product.lotes[0].amount);
            }
        }
    }, [product]);

    return (
        <Container>
            <Card
                onPress={() => {
                    navigation.navigate('ProductDetails', { id: product.id });
                }}
                expired={expired}
                nextToExp={nextToExp}
            >
                <ProductDetails>
                    <ProductDetailsContainer>
                        <ProductName expiredOrNext={expiredOrNext}>
                            {product.name}
                        </ProductName>
                        {!!product.code && (
                            <ProductCode expiredOrNext={expiredOrNext}>
                                Código: {product.code}
                            </ProductCode>
                        )}

                        {product.lotes.length > 0 && (
                            <ProductLote expiredOrNext={expiredOrNext}>
                                Lote: {product.lotes[0].lote}
                            </ProductLote>
                        )}

                        {multipleStoresState && !!product.store && (
                            <ProductStore expiredOrNext={expiredOrNext}>
                                Loja: {product.store}
                            </ProductStore>
                        )}
                    </ProductDetailsContainer>

                    {product.lotes.length > 0 && (
                        <LoteDetailsContainer>
                            <AmountContainer>
                                <AmountContainerText
                                    expiredOrNext={expiredOrNext}
                                >
                                    Quantidade
                                </AmountContainerText>
                                <Amount expiredOrNext={expiredOrNext}>
                                    {product.lotes[0].amount}
                                </Amount>
                            </AmountContainer>

                            {totalPrice > 0 && (
                                <PriceContainer>
                                    <PriceContainerText
                                        expiredOrNext={expiredOrNext}
                                    >
                                        Preço total
                                    </PriceContainerText>
                                    <Price expiredOrNext={expiredOrNext}>
                                        <NumberFormat
                                            value={totalPrice}
                                            displayType="text"
                                            thousandSeparator
                                            prefix="R$"
                                            renderText={(value) => value}
                                            decimalScale={2}
                                        />
                                    </Price>
                                </PriceContainer>
                            )}
                        </LoteDetailsContainer>
                    )}
                </ProductDetails>

                {!!product.lotes.length && (
                    <ProductExpDate expiredOrNext={expiredOrNext}>
                        {expired ? 'Venceu ' : 'Vence '}
                        {formatDistanceToNow(product.lotes[0].exp_date, {
                            addSuffix: true,
                            locale: br,
                        })}
                        {format(
                            product.lotes[0].exp_date,
                            ', EEEE, dd/MM/yyyy',
                            {
                                locale: br,
                            }
                        )}
                    </ProductExpDate>
                )}
            </Card>
        </Container>
    );
};

export default React.memo(Product);