import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
    background: ${(props) => props.theme.colors.background};
`;
export const HeaderContainer = styled.View`
    width: 100%;
    padding: 15px 30px 15px 0px;

    justify-content: flex-start;
    align-items: center;

    background-color: ${(props) => props.theme.colors.accent};

    flex-direction: row;
`;

export const TextLogo = styled.Text`
    font-size: 28px;
    font-weight: bold;
    color: white;
`;
export const CategoryDetails = styled.View`
    margin-top: 15px;
    flex-direction: row;
    justify-content: space-between;

    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 5px;
`;

export const CategoryDetailsText = styled.Text`
    color: ${(props) => props.theme.colors.textAccent};
    font-size: 18px;
`;
