import React from 'react';

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';

import {Container, Footer, FooterWrapper, Header, SignInTitle, Title, TitleWrapper} from './styles'
import {RFValue} from 'react-native-responsive-fontsize';
import {SignInSocialButton} from '../../components/SignInSocialButton';
import {useAuth} from '../../hooks/auth';
import {Alert} from 'react-native';

export function SignIn() {
  const { signInWithGoogle } = useAuth();

  async function handleSignInWithGoogle() {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível conectar a conta Google');
    }
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg
            width={RFValue(120)}
            height={RFValue(68)}
          />
          <Title>
            Controle suas {'\n'}
            finanças de forma {'\n'}
            muito simples {'\n'}
          </Title>
        </TitleWrapper>

        <SignInTitle>
          Faça seu login com {'\n'}
          uma das contas abaixo
        </SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton
            title={'Entrar com Google'}
            svg={GoogleSvg}
            onPress={handleSignInWithGoogle}/>
          <SignInSocialButton title={'Entrar com Appe'} svg={AppleSvg}/>
        </FooterWrapper>
      </Footer>
    </Container>
  )
}
