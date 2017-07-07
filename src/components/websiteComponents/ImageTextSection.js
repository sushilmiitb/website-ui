var React = require('react');
import {Grid, Header, Image, Button} from 'semantic-ui-react';
import {OnHoverColorChangeButton} from './OnHoverColorChangeButton';
import { Link } from 'react-router-dom';
import {ScrollBasedTransition} from '../animation/ScrollBasedTransition';

export class ImageTextSection extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        const tabComputerOnlyImageComponent = (
            <ScrollBasedTransition transitionClassName="fade" marginFromBottom={0.15} marginFromTop={0.05} Component={Grid.Column}
                widescreen={4}
                largeScreen={4}
                computer={5}
                tablet={6}
                only="tablet computer" >
                <Image centered src={this.props.image} />
            </ScrollBasedTransition>
        );
        const mobileOnlyImageComponent = (
            <ScrollBasedTransition transitionClassName="fade" marginFromBottom={0.15} marginFromTop={0.05} Component={Grid.Column}
                only="mobile"
                mobile={14}>
                <Image centered src={this.props.image} />
            </ScrollBasedTransition>
        );
        const textComponent = (
            <ScrollBasedTransition transitionClassName="fade" marginFromBottom={0.15} marginFromTop={0.05} Component={Grid.Column} transitionDelay="1"
                widescreen={5}
                largeScreen={5}
                computer={6}
                tablet={7}
                mobile={14}>
                <Header as='h3'>
                    {this.props.content.header}
                </Header>
                <p>
                    {this.props.content.para}
                </p>
                {
                    (typeof(this.props.link) != 'undefined')?(
                        <OnHoverColorChangeButton as={Link} to={this.props.link.destination} color="blue">
                            {this.props.link.text}
                        </OnHoverColorChangeButton>
                    ):
                    (
                        null
                    )
                }
            </ScrollBasedTransition>
        );
        return(
            <Grid.Row verticalAlign="top" className={this.props.className}>
                {mobileOnlyImageComponent}
                {
                    (typeof(this.props.rightAligned)!='undefined')?(
                        <Grid.Column only="tablet computer" width={1}></Grid.Column>
                    ):
                    (
                        null
                    )
                }
                {
                    (!this.props.reversed)?
                    (
                        tabComputerOnlyImageComponent
                    ):
                    (
                        textComponent
                    )
                }
                {
                    (!this.props.reversed)?
                    (
                        textComponent
                    ):
                    (
                        tabComputerOnlyImageComponent
                    )
                }
                {
                    (typeof(this.props.leftAligned)!='undefined')?(
                        <Grid.Column only="tablet computer" width={1}></Grid.Column>
                    ):
                    (
                        null
                    )
                }
            </Grid.Row>
        );
    }
}
