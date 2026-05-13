import { Link, type ExternalPathString } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Platform } from 'react-native';

type Props = Omit<React.ComponentProps<typeof Link>, 'href'> & { href: ExternalPathString };

export function ExternalLink(props: Props) {
  return (
    <Link
      target="_blank"
      {...props}
      href={props.href}
      onPress={(e) => {
        if (Platform.OS !== 'web') {
          e.preventDefault();
          WebBrowser.openBrowserAsync(props.href);
        }
      }}
    />
  );
}
