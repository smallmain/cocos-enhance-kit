
import cocos
from MultiLanguage import MultiLanguage

from package.helper import ProjectHelper


class FrameworkRemove(cocos.CCPlugin):
    @staticmethod
    def plugin_name():
        return "remove-framework"

    @staticmethod
    def brief_description():
        return MultiLanguage.get_string('FRAMEWORK_REMOVE_BRIEF')

    # parse arguments
    def parse_args(self, argv):
        from argparse import ArgumentParser

        parser = ArgumentParser(prog="cocos %s" % self.__class__.plugin_name(),
                                description=self.__class__.brief_description())
        parser.add_argument("name", metavar="NAME", help=MultiLanguage.get_string('FRAMEWORK_REMOVE_ARG_NAME'))
        return parser.parse_args(argv)

    def run(self, argv):
        args = self.parse_args(argv)
        name = args.name

        project = ProjectHelper.get_current_project()
        ProjectHelper.remove_framework(project, name)
